import { Hono } from "npm:hono@4";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use("*", cors());
app.use("*", logger(console.log));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// ============== AUTH ROUTES ==============

// Signup
app.post("/make-server-0c7f2afa/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Auto-confirm since no email server configured
    });

    if (error) {
      console.error("Signup error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ data });
  } catch (error) {
    console.error("Signup catch error:", error);
    return c.json({ error: "Internal server error during signup" }, 500);
  }
});

// Get current user
app.get("/make-server-0c7f2afa/auth/user", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// ============== PROMOTIONS ROUTES ==============

// Get all promotions
app.get("/make-server-0c7f2afa/promotions", async (c) => {
  try {
    const promotions = await kv.getByPrefix("promotion:");
    return c.json({ promotions });
  } catch (error) {
    console.error("Error fetching promotions:", error);
    return c.json({ error: "Failed to fetch promotions" }, 500);
  }
});

// Get single promotion
app.get("/make-server-0c7f2afa/promotions/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const promotion = await kv.get(`promotion:${id}`);
    
    if (!promotion) {
      return c.json({ error: "Promotion not found" }, 404);
    }

    return c.json({ promotion });
  } catch (error) {
    console.error("Error fetching promotion:", error);
    return c.json({ error: "Failed to fetch promotion" }, 500);
  }
});

// Create promotion (protected)
app.post("/make-server-0c7f2afa/promotions", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const promotion = await c.req.json();
    const id = promotion.id || crypto.randomUUID();
    
    await kv.set(`promotion:${id}`, { ...promotion, id });
    
    return c.json({ promotion: { ...promotion, id } });
  } catch (error) {
    console.error("Error creating promotion:", error);
    return c.json({ error: "Failed to create promotion" }, 500);
  }
});

// Update promotion (protected)
app.put("/make-server-0c7f2afa/promotions/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");
    const promotion = await c.req.json();
    
    await kv.set(`promotion:${id}`, { ...promotion, id });
    
    return c.json({ promotion: { ...promotion, id } });
  } catch (error) {
    console.error("Error updating promotion:", error);
    return c.json({ error: "Failed to update promotion" }, 500);
  }
});

// Delete promotion (protected)
app.delete("/make-server-0c7f2afa/promotions/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");
    await kv.del(`promotion:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting promotion:", error);
    return c.json({ error: "Failed to delete promotion" }, 500);
  }
});

// ============== SERVICES ROUTES ==============

// Get all services
app.get("/make-server-0c7f2afa/services", async (c) => {
  try {
    const services = await kv.getByPrefix("service:");
    return c.json({ services });
  } catch (error) {
    console.error("Error fetching services:", error);
    return c.json({ error: "Failed to fetch services" }, 500);
  }
});

// Get single service
app.get("/make-server-0c7f2afa/services/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const service = await kv.get(`service:${id}`);
    
    if (!service) {
      return c.json({ error: "Service not found" }, 404);
    }

    return c.json({ service });
  } catch (error) {
    console.error("Error fetching service:", error);
    return c.json({ error: "Failed to fetch service" }, 500);
  }
});

// Create service (protected)
app.post("/make-server-0c7f2afa/services", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const service = await c.req.json();
    const id = service.id || crypto.randomUUID();
    
    await kv.set(`service:${id}`, { ...service, id });
    
    return c.json({ service: { ...service, id } });
  } catch (error) {
    console.error("Error creating service:", error);
    return c.json({ error: "Failed to create service" }, 500);
  }
});

// Update service (protected)
app.put("/make-server-0c7f2afa/services/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");
    const service = await c.req.json();
    
    await kv.set(`service:${id}`, { ...service, id });
    
    return c.json({ service: { ...service, id } });
  } catch (error) {
    console.error("Error updating service:", error);
    return c.json({ error: "Failed to update service" }, 500);
  }
});

// Delete service (protected)
app.delete("/make-server-0c7f2afa/services/:id", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);

    if (authError || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const id = c.req.param("id");
    await kv.del(`service:${id}`);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return c.json({ error: "Failed to delete service" }, 500);
  }
});

// ============== CONTACT FORM ROUTE ==============

// Submit contact form
app.post("/make-server-0c7f2afa/contact", async (c) => {
  try {
    const contactData = await c.req.json();
    const id = crypto.randomUUID();
    
    await kv.set(`contact:${id}`, {
      ...contactData,
      id,
      createdAt: new Date().toISOString(),
    });
    
    return c.json({ success: true, id });
  } catch (error) {
    console.error("Error saving contact form:", error);
    return c.json({ error: "Failed to save contact form" }, 500);
  }
});

// Health check
app.get("/make-server-0c7f2afa/health", (c) => {
  return c.json({ status: "ok" });
});

Deno.serve(app.fetch);
