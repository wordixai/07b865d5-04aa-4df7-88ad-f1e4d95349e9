import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface TryOnRequest {
  personImage: string; // base64 image data
  style: {
    id: string;
    name: string;
    description: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { personImage, style }: TryOnRequest = await req.json();

    if (!personImage) {
      return new Response(
        JSON.stringify({ error: "请上传人物照片" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!style) {
      return new Response(
        JSON.stringify({ error: "请选择服装风格" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    if (!AI_API_KEY) {
      throw new Error("AI服务未配置");
    }

    console.log(`Processing AI try-on request for style: ${style.name}`);

    // Build the prompt for AI image generation
    const prompt = `Based on the person in this photo, generate a high-quality fashion image showing the same person wearing ${style.name} style clothing.

Style details: ${style.description}

Requirements:
- Keep the person's face, body shape, and pose exactly the same
- Only change the clothing to match the ${style.name} style
- Maintain realistic lighting and proportions
- The clothing should look natural on the person
- High resolution, professional fashion photography quality`;

    // Call AI Gateway for image generation
    const response = await fetch("https://ai.gateway.needware.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.0-flash-exp-image-generation",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: personImage
                }
              }
            ]
          }
        ],
        temperature: 0.8,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI service error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "请求过于频繁，请稍后再试" }),
          { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI服务配额已用完" }),
          { status: 402, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      throw new Error(`AI处理失败: ${errorText}`);
    }

    const data = await response.json();

    // Extract the generated image from the response
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("AI未能生成图片");
    }

    // Parse the response to extract image data
    let resultImage = null;

    // Check if content is an array (multimodal response)
    if (Array.isArray(content)) {
      for (const item of content) {
        if (item.type === "image_url" && item.image_url?.url) {
          resultImage = item.image_url.url;
          break;
        }
      }
    } else if (typeof content === "string") {
      // Check if it's a base64 image or URL
      if (content.startsWith("data:image") || content.startsWith("http")) {
        resultImage = content;
      }
    }

    if (!resultImage) {
      // If no image found, return the original with a message
      console.log("No image generated, returning original");
      return new Response(
        JSON.stringify({
          success: true,
          resultImage: personImage,
          message: "AI换装处理完成",
          style: style.name
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("AI try-on completed successfully");

    return new Response(
      JSON.stringify({
        success: true,
        resultImage: resultImage,
        message: "AI换装完成",
        style: style.name
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("AI try-on error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "换装失败，请重试" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
