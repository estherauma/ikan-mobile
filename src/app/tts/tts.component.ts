import { Component, OnInit } from '@angular/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
  selector: 'app-tts',
  templateUrl: './tts.component.html',
  styleUrls: ['./tts.component.scss'],
  standalone: false,
})
export class TtsComponent implements OnInit {
  availableVoices: any = [];
  availableLanguages: any = [];

  languageSamples: any = [];
  englishChallenges = [
    {
      title: 'The Old Lighthouse',
      text: 'For over three decades, the lighthouse on the jagged northern cliff stood as an unwavering beacon. Every evening, as darkness settled over the cold, turbulent ocean, its steady beam swept across the water, guiding lost ships toward the safety of the harbor.',
      focus:
        'Standard prose cadence, comma pauses, and smooth sentence transitions',
    },
    {
      title: 'Emergency Drill',
      text: 'Attention all personnel! This is an immediate level-two safety alert. Please secure your workstations, double-check all pressure valves, and proceed toward the designated emergency exits without running. Repeat: do not use the elevators under any circumstances.',
      focus:
        'Fast pacing, exclamations, colon pauses, and imperative command intonation',
    },
    {
      title: 'Flight Briefing',
      text: 'Flight 408 is cleared for departure via Runway 27-Left at 14:45 GMT. Expected cruise altitude is 34,000 feet, with wind speeds reaching 45 knots from the northwest. Total flight time will be approximately 3 hours, 42 minutes, and 15 seconds.',
      focus:
        'Time formats, large numbers, units of measure, and hyphenated designations',
    },
    {
      title: 'System Log',
      text: 'Error 404: WebService endpoint non-responsive. The asynchronous JavaScript module failed to deserialize the JSON response payload. Please verify that your API key is active, check the HTTP authorization headers, and ensure WebSocket connections are permitted on port 8080.',
      focus:
        'Technical terms, acronyms (HTTP, JSON, API), and system code phrasing',
    },
    {
      title: 'A Surprising Discovery',
      text: '"Wait, are you telling me you actually found it?" Sarah stared at the ancient journal in disbelief. "I thought it was destroyed years ago! How on earth did you manage to track down something so rare?"',
      focus:
        'Question inflections, direct quotes, emotional variety, and pitch changes',
    },
    {
      title: 'Phonetic Stress Test',
      text: 'Thirty-three thirsty thieves thought they thrilled the throne throughout Thursday. Meanwhile, unique New York copper kettles were polished diligently by six slick Swiss mechanics.',
      focus: 'Tricky consonant clusters (th, s, k, str) and phoneme clarity',
    },
  ];
  indonesianChallenges = [
    {
      title: 'Anak-anak di Warung',
      text: 'Anak-anak sedang makan nasi goreng dan minum teh manis hangat di tepi jalan. Ibu mereka membeli lima ekor bebek untuk dimasak besok sore.',
      focus: 'Vowel "E" pronunciations and hyphenated words',
    },
    {
      title: 'Laporan Cuaca dan Lalu Lintas',
      text: 'Menurut BMKG, suhu udara di wilayah DKI Jakarta hari ini mencapai 33°C dengan kelembapan 75%. Petugas Polda Metro Jaya mengimbau para pengendara untuk menghindari area Gelora Bung Karno pada pukul 14.30 WIB.',
      focus: 'Acronyms, temperatures, times, and percentages',
    },
    {
      title: 'Pengumuman Sistem Teknologi',
      text: 'Pembaruan perangkat lunak telah berhasil diunduh. Silakan lakukan verifikasi identitas melalui aplikasi seluler Anda untuk mengoptimalkan efisiensi dan keamanan data pribadi.',
      focus: 'Formal terms and technical loanwords',
    },
    {
      title: 'Peringatan Darurat',
      text: 'Perhatian kepada seluruh pengunjung! Mohon segera tinggalkan area lantai dua melalui tangga darurat terdekat. Jangan menggunakan lift, dan tetap tenang selama proses evakuasi berlangsung.',
      focus: 'Urgent cadence and command intonation',
    },
    {
      title: 'Percakapan Singkat',
      text: '"Lho, bukannya kamu bilang mau berangkat jam delapan?" tanya Budi. "Iya, tapi mendadak hujan deras sekali! Mana kunci motor saya hilang lagi," jawab Rina dengan bingung.',
      focus: 'Dialogue, exclamations, and question inflections',
    },
    {
      title: 'Uji Artikulasi',
      text: 'Satu ribu, dua ribu, tiga ribu, empat ribu, lima ribu. Kuku kaki kakak-kakak ku kayak kuku kaki kakek-kakek ku yang kaku.',
      focus: 'Rapid repeating consonants and number sequencing',
    },
  ];
  mandarinChallenges = [
    {
      title: '晴朗的早晨',
      text: '张阿姨今天早上买了几斤新鲜的苹果和橙子。她走到公园里，看见许多老人在高高兴兴地打太极拳。',
      pinyin:
        'Zhāng āyí jīntiān zǎoshang mǎi le jǐ jīn xīnxiān de píngguǒ hé chéngzi...',
      focus: '3rd tone sandhi and neutral light tones',
    },
    {
      title: '银行与生长',
      text: '我今天步行去中国银行开户，行长对我的业务非常满意。回家路上，我发现路边的小树苗已经长高了很多。',
      pinyin: 'Wǒ jīntiān bùxíng qù Zhōngguó Yínháng kāihù...',
      focus: 'Polyphonic characters (多音字: 行 xíng/háng, 长 zhǎng)',
    },
    {
      title: '航班与消费确认',
      text: '您的航班 CZ3101 将于 2026 年 8 月 15 日 14:30 从 3 号航站楼起飞。订单总金额为 1,580.50 元。',
      pinyin:
        'Nín de hángbān CZ sān-yāo-líng-yī jiāng yú èr-líng-èr-liù nián...',
      focus: 'Flight codes (1=yāo), dates, times, and currency formatting',
    },
    {
      title: '经典平翘舌测试',
      text: '四是四，十是十，十四是十四，四十是四十。四十四只石狮子是实的。',
      pinyin: 'Sì shì sì, shí shì shí, shísì shì shísì...',
      focus: 'Flat vs. retroflex consonants (s vs. sh) and pitch accuracy',
    },
    {
      title: '餐厅点餐',
      text: '“服务员，请问这个宫保鸡丁辣不辣？”“不太辣，先生！您要配米饭还是面条呢？”',
      pinyin: '“Fúwùyuán, qǐngwèn zhège gōngbǎojīdīng là bu là?”...',
      focus: 'Conversational pitch and question mark intonation',
    },
    {
      title: '系统更新通知',
      text: '您的 App 已成功升级至 2.0 版本。系统集成了全新的 AI 语音助手，并优化了 Wi-Fi 自动连接功能。',
      pinyin: 'Nín de App yǐ chénggōng shēngjí zhì èr-diǎn-líng bǎnběn...',
      focus:
        'Code-switching between Chinese and English terms (AI, App, Wi-Fi)',
    },
  ];

  constructor() {}

  async ngOnInit() {
    this.languageSamples = [
      {
        label: 'English US',
        code: 'en-US',
        challenges: this.englishChallenges,
      },
      {
        label: 'English UK',
        code: 'en-GB',
        challenges: this.englishChallenges,
      },
      {
        label: 'Indonesian',
        code: 'id-ID',
        challenges: this.indonesianChallenges,
      },
      {
        label: 'Mandarin',
        code: 'zh-CN',
        challenges: this.mandarinChallenges,
      },
      {
        label: 'English AU',
        code: 'en-AU',
        challenges: this.englishChallenges,
      },
      {
        label: 'Spanish (Spain - es-ES)',
        code: 'es-ES',
        challenges: [
          {
            title: 'El Ferrocarril y la Lluvia',
            text: 'El ferrocarril rápido rueda por los rieles mientras Ramón corre bajo la lluvia. El perro de Rosa roba un ramo de rosas rojas y corre hacia la calle.',
            focus: 'Rolled "rr" sounds and initial "r" trills',
          },
          {
            title: 'Un Día en el Jardín',
            text: 'El niño pequeño comió un delicioso melocotón en el jardín del señor Peña. La niña le pidió que le enseñara su camión azul antes de que fuera la hora de cenar.',
            focus: 'Accent marks (á, é, í, ó, ú) and the ñ sound',
          },
          {
            title: 'Confirmación de Reserva',
            text: 'Su número de confirmación es el 948-201. La llegada está programada para el 25 de julio de 2026 a las 18:30 horas. El costo total es de 1.450,75 euros.',
            focus: 'Dates, 24-hour time formats, numbers, and currency',
          },
        ],
      },
      {
        label: 'Spanish (Mexico / LatAm - es-MX)',
        code: 'es-MX',
        challenges: [
          {
            title: '¡Una Sorpresa Inesperada!',
            text: '¿De verdad me estás diciendo que ganamos el partido? ¡No lo puedo creer! ¿Cuándo empieza la siguiente ronda y contra quién jugaremos?',
            focus: 'Question and exclamation pitch modulation',
          },
          {
            title: 'En la Cafetería',
            text: '—Buenos días, ¿me da un café con leche y un pan dulce, por favor? —¡Por supuesto! ¿Lo quiere para llevar? —Sin azúcar, gracias.',
            focus: 'Conversational dialogue cadence and pauses',
          },
          {
            title: 'Actualización del Sistema',
            text: 'Su smartphone se conectó a la red Wi-Fi y descargó la actualización del software. Inicie sesión con su email y active el bluetooth.',
            focus:
              'Anglicisms and technical vocabulary (Wi-Fi, email, bluetooth)',
          },
        ],
      },
    ];
    this.availableVoices = await TextToSpeech.getSupportedVoices()
      .then((voices) => {
        this.availableVoices = voices;
        console.log('Available voices:', this.availableVoices);
      })
      .catch((error) => {
        console.error('Error fetching supported voices:', error);
      });
    this.availableLanguages = await TextToSpeech.getSupportedLanguages()
      .then((languages) => {
        this.availableLanguages = languages;
        console.log('Available languages:', this.availableLanguages);
      })
      .catch((error) => {
        console.error('Error fetching supported languages:', error);
      });
  }

  async speakText(text: string, langCode: string) {
    try {
      await TextToSpeech.speak({
        text: text,
        lang: langCode,
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
      });
    } catch (error) {
      console.error('Error triggering TTS:', error);
    }
  }
}
