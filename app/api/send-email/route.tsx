import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, message } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "El mensaje es requerido" },
        { status: 400 }
      );
    }

    // Usar Resend para enviar el email
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev", // Dominio verificado en Resend
        to: ["sofiavalbornoz@gmail.com"],
        subject: `Mensaje de ${name || "Visitante del portfolio"}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #374151; border-bottom: 2px solid #abb27f; padding-bottom: 10px;">
              Nuevo mensaje desde el portfolio
            </h2>
            
            <div style="margin: 20px 0;">
              <p><strong>Nombre:</strong> ${name || "No especificado"}</p>
            </div>
            
            <div style="margin: 20px 0;">
              <p><strong>Mensaje:</strong></p>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #abb27f;">
                ${message.replace(/\n/g, "<br>")}
              </div>
            </div>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; text-align: center;">
              Enviado desde el portfolio de Sofia Albornoz
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error de Resend:", errorData);
      return NextResponse.json(
        { error: "Error al enviar el email" },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    console.error("Error en API send-email:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
