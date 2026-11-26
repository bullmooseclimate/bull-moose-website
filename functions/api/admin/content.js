function github(env, path) {
  return `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${path}`;
}

function headers(env) {
  return {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "Bull-Moose-Climate-Systems"
  };
}

function jsonError(message, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    }
  });
}

export async function onRequest({ request, env }) {
  if (!request.headers.get("cf-access-jwt-assertion")) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!env.GITHUB_TOKEN || !env.GITHUB_OWNER || !env.GITHUB_REPO) {
    return jsonError("Missing GitHub environment configuration");
  }

  try {
    const path = "content/site.json";
    const url = github(env, path);
    const h = headers(env);

    if (request.method === "GET") {
      const response = await fetch(url, { headers: h });

      if (!response.ok) {
        return jsonError(
          `GitHub GET failed (${response.status}): ${await response.text()}`,
          response.status
        );
      }

      const file = await response.json();

      if (!file.content || typeof file.content !== "string") {
        return jsonError("GitHub returned no file content for content/site.json");
      }

      const base64 = file.content.replace(/\s/g, "");
      const binary = atob(base64);
      const bytes = Uint8Array.from(
        binary,
        character => character.charCodeAt(0)
      );
      const decoded = new TextDecoder().decode(bytes);

      return new Response(decoded, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        }
      });
    }

    if (request.method === "PUT") {
      let body;

      try {
        body = await request.json();
      } catch {
        return jsonError("Invalid JSON", 400);
      }

      const old = await fetch(url, { headers: h });

      if (!old.ok) {
        return jsonError(
          `GitHub lookup failed (${old.status}): ${await old.text()}`,
          old.status
        );
      }

      const sha = (await old.json()).sha;

      const bytes = new TextEncoder().encode(
        JSON.stringify(body, null, 2)
      );

      let binary = "";

      bytes.forEach(byte => {
        binary += String.fromCharCode(byte);
      });

      const payload = {
        message: "Update website content from admin",
        content: btoa(binary),
        branch: env.GITHUB_BRANCH || "main",
        sha
      };

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          ...h,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      return new Response(await response.text(), {
        status: response.status,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store"
        }
      });
    }

    return new Response("Method not allowed", { status: 405 });

  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);

    console.error("Admin content function failed:", message);

    return jsonError(`Admin content function failed: ${message}`);
  }
}
