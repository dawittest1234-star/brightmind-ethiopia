export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const { fullName, email, phone, service, appointmentDate, message } =
      JSON.parse(event.body);

    if (!fullName || !email || !phone || !service || !appointmentDate || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Please complete all required fields." })
      };
    }

    const telegramMessage = [
      "NEW APPOINTMENT REQUEST",
      "",
      `Name: ${fullName}`,
      `Phone: ${phone}`,
      `Email: ${email}`,
      `Service: ${service}`,
      `Preferred date: ${appointmentDate}`,
      "",
      "Concern:",
      message
    ].join("\n");

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: telegramMessage
        })
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramData.ok) {
      throw new Error("Telegram failed");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Unable to send appointment."
      })
    };
  }
}