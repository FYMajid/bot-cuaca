import { SlashCommandBuilder } from "discord.js";
import fetch from "node-fetch";

export const data = new SlashCommandBuilder()
  .setName("cuaca")
  .setDescription("Lihat cuaca dari suatu kota")
  .addStringOption((option) =>
    option.setName("kota").setDescription("Nama kota").setRequired(true)
  );

export async function execute(interaction) {
  const city = interaction.options.getString("kota");
  const apiKey = process.env.OPENWEATHER_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&units=metric&appid=${apiKey}&lang=id`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod !== 200) {
      return interaction.reply(`❌ Kota "${city}" tidak ditemukan.`);
    }

    const kondisi = data.weather[0].description;
    const suhu = data.main.temp;
    const terasa = data.main.feels_like;

    return interaction.reply(
      `🌦️ Cuaca di **${data.name}**:\n- Kondisi: **${kondisi}**\n- Suhu: **${suhu}°C**\n- Terasa seperti: **${terasa}°C**`
    );
  } catch (error) {
    console.error(error);
    return interaction.reply("❌ Terjadi kesalahan saat mengambil data cuaca.");
  }
}
