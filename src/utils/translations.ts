export type Language = 'en' | 'hi' | 'es' | 'ja' | 'de' | 'fr';

export interface Translations {
  appName: string;
  tagline: string;
  modes: {
    rage: string;
    rant: string;
    bubble: string;
    zenPond: string;
    breath: string;
    soap: string;
  };
  rage: {
    title: string;
    subtitle: string;
    selectTool: string;
    selectTarget: string;
    clickToSmash: string;
    combo: string;
    smashed: string;
    repair: string;
    autoHeal: string;
    hp: string;
    screenShake: string;
  };
  rant: {
    title: string;
    subtitle: string;
    placeholder: string;
    presetsTitle: string;
    presets: string[];
    actionShred: string;
    actionBurn: string;
    actionRocket: string;
    actionCrush: string;
    emptyWarning: string;
    destroyedNotice: string;
  };
  bubble: {
    title: string;
    subtitle: string;
    poppedCount: string;
    resetGrid: string;
    infiniteMode: string;
  };
  zen: {
    title: string;
    subtitle: string;
    dragInstructions: string;
    chimesNotice: string;
    resetPond: string;
  };
  breath: {
    title: string;
    subtitle: string;
    inhale: string;
    hold: string;
    exhale: string;
    cyclesDone: string;
    mode478: string;
    modeBox: string;
    start: string;
    pause: string;
  };
  soap: {
    title: string;
    subtitle: string;
    dragToCut: string;
    resetBar: string;
    cubesLeft: string;
  };
  stats: {
    title: string;
    stressDestroyed: string;
    itemsSmashed: string;
    bubblesPopped: string;
    zenMinutes: string;
    worldwideTotal: string;
    shareBtn: string;
    copied: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: 'SmashChill',
    tagline: 'Smash your stress. Find your calm.',
    modes: {
      rage: 'Smash Room',
      rant: 'Rant Shredder',
      bubble: 'Bubble Pop',
      zenPond: 'Zen Pond',
      breath: 'Deep Breathe',
      soap: 'ASMR Carve',
    },
    rage: {
      title: 'Destruction Chamber',
      subtitle: 'Click, tap, and obliterate annoying objects with full physics.',
      selectTool: 'Choose Weapon',
      selectTarget: 'Pick Target',
      clickToSmash: 'Click anywhere on the object to hit!',
      combo: 'RAGE COMBO',
      smashed: 'OBLITERATED!',
      repair: 'Spawn Fresh Item',
      autoHeal: 'Reset',
      hp: 'Durability',
      screenShake: 'Screen Shake',
    },
    rant: {
      title: 'Rant Shredder & Burner',
      subtitle: 'Type what ruined your day, then destroy it forever.',
      placeholder: 'Vent your frustration here... (e.g. My boss calling at 9 PM, traffic jam, exam stress, printer refusing to print...)',
      presetsTitle: 'Quick venting triggers:',
      presets: [
        'Urgent message on Friday at 6:00 PM',
        'Endless meetings that should have been an email',
        'Wi-Fi disconnecting during an important call',
        'People who walk ultra slow in front of me',
        'Overthinking everything at 3:00 AM',
      ],
      actionShred: 'Shred to Strips',
      actionBurn: 'Incinerate to Ash',
      actionRocket: 'Launch to Deep Space',
      actionCrush: 'Hydraulic Crush',
      emptyWarning: 'Please type what you want to destroy first!',
      destroyedNotice: 'It is gone. Take a deep breath. You are in control.',
    },
    bubble: {
      title: 'Endless Bubble Sensory',
      subtitle: 'Pop to your heart’s content with crisp ASMR haptics.',
      poppedCount: 'Bubbles Popped',
      resetGrid: 'Fresh Sheet',
      infiniteMode: 'Auto-Replenish',
    },
    zen: {
      title: 'Tranquil Ripple Pond',
      subtitle: 'Glide your cursor or finger to create water ripples and harmonious chimes.',
      dragInstructions: 'Drag or click on water to generate ripples & pentatonic chimes',
      chimesNotice: 'Tuned to D-major pentatonic harmony',
      resetPond: 'Clear Water',
    },
    breath: {
      title: 'Calm Breathing Orb',
      subtitle: 'Restore your autonomic nervous system in just 2 minutes.',
      inhale: 'Breathe In Deeply...',
      hold: 'Hold Your Breath...',
      exhale: 'Slowly Exhale & Release...',
      cyclesDone: 'Completed Cycles',
      mode478: '4-7-8 Relaxing',
      modeBox: '4-4-4 Box Focus',
      start: 'Begin Breathing',
      pause: 'Pause',
    },
    soap: {
      title: 'Kinetic Sand & Soap Carver',
      subtitle: 'Drag the cutter across the block to slice satisfying ribbons.',
      dragToCut: 'Drag blade across the cubes to slice them',
      resetBar: 'New Soap Block',
      cubesLeft: 'Cubes Remaining',
    },
    stats: {
      title: 'Global Stress Counter',
      stressDestroyed: 'Total Frustration Destroyed',
      itemsSmashed: 'Items Smashed',
      bubblesPopped: 'Bubbles Popped',
      zenMinutes: 'Calm Breaths Taken',
      worldwideTotal: 'Over 2.4M people calmed across 140 countries.',
      shareBtn: 'Share Stress Relief',
      copied: 'Link copied! Share it with someone who needs to vent.',
    },
  },
  hi: {
    appName: 'SmashChill',
    tagline: 'भड़ास निकालो, दिल को शांत करो।',
    modes: {
      rage: 'भड़ास रूम (Smash)',
      rant: 'गुस्सा जलाओ (Burn)',
      bubble: 'बबल रैप (Pop)',
      zenPond: 'शांत तालाब (Zen)',
      breath: 'प्राणायाम (Breathe)',
      soap: 'साबुन कटाई (ASMR)',
    },
    rage: {
      title: 'भड़ास निकालने का कमरा',
      subtitle: 'हथौड़े, बल्ले या लेज़र से ऑफिस की चिड़चिड़ाहट को चूर-चूर कर दो।',
      selectTool: 'हथियार चुनो',
      selectTarget: 'सामान चुनो',
      clickToSmash: 'तोड़ने के लिए वस्तु पर लगातार क्लिक या टैप करो!',
      combo: 'रौद्र कॉम्बो',
      smashed: 'चकनाचूर हो गया!',
      repair: 'नया सामान लाओ',
      autoHeal: 'रीसेट करें',
      hp: 'सहनशक्ति',
      screenShake: 'स्क्रीन कंपन',
    },
    rant: {
      title: 'गुस्सा लिखो और फूँक दो',
      subtitle: 'जो भी बात परेशान कर रही है उसे लिखो और हमेशा के लिए नष्ट कर दो।',
      placeholder: 'अपनी पूरी भड़ास यहाँ लिखो... (जैसे: बॉस की फालतू ईमेल, ट्रैफिक जाम, पढ़ाई का तनाव, बेवजह की बहस...)',
      presetsTitle: 'आम परेशानियाँ:',
      presets: [
        'शुक्रवार शाम को अचानक आया अर्जेंट काम',
        'वो मीटिंग्स जिनका काम एक ईमेल से हो सकता था',
        'ज़रूरी काम के बीच में वाई-फाई का गायब होना',
        'सामने धीरे-धीरे चलने वाले लोग',
        'रात को बेवजह ओवरथिंकिंग करना',
      ],
      actionShred: 'मशीन में कतरन बनाओ',
      actionBurn: 'आग में स्वाहा करो',
      actionRocket: 'रॉकेट से अंतरिक्ष भेजो',
      actionCrush: 'हथौड़े से पीस दो',
      emptyWarning: 'पहले अपनी भड़ास या परेशानी लिखो!',
      destroyedNotice: 'गया काम से! अब एक गहरी सांस लो। शांति बनाए रखो।',
    },
    bubble: {
      title: 'बबल रैप थेरेपी',
      subtitle: 'फटाफट बबल फोड़ो और अपने दिमाग को शांत करो।',
      poppedCount: 'फोड़े गए बबल',
      resetGrid: 'नयी शीट लाओ',
      infiniteMode: 'अनंत शीट',
    },
    zen: {
      title: 'शांत जल तरंगें',
      subtitle: 'उंगली फिराओ, पानी में लहरें बनाओ और मधुर धुन सुनो।',
      dragInstructions: 'लहरें और शांतिदायक संगीत पैदा करने के लिए पानी पर हाथ घुमाएं',
      chimesNotice: 'पेंटाटोनिक शांतिदायक स्वर',
      resetPond: 'पानी शांत करो',
    },
    breath: {
      title: 'गहरी सांस (प्राणायाम)',
      subtitle: 'सिर्फ 2 मिनट में अपने गुस्से और धड़कन को नियंत्रित करो।',
      inhale: 'गहरी सांस अंदर खींचो...',
      hold: 'सांस रोके रखो...',
      exhale: 'धीमे-धीमे सांस बाहर छोड़ो...',
      cyclesDone: 'पूरे चक्र',
      mode478: '4-7-8 सुकून मोड',
      modeBox: '4-4-4 ध्यान मोड',
      start: 'शुरू करें',
      pause: 'रोकें',
    },
    soap: {
      title: 'साबुन और रेत की नक्काशी',
      subtitle: 'ब्लेड चलाओ और कुरकुरी ASMR आवाज़ के साथ टुकड़े काटो।',
      dragToCut: 'टुकड़े काटने के लिए कटर को घुमाएं',
      resetBar: 'नया साबुन',
      cubesLeft: 'बचे हुए टुकड़े',
    },
    stats: {
      title: 'वैश्विक शांति काउंटर',
      stressDestroyed: 'नष्ट किया गया मानसिक तनाव',
      itemsSmashed: 'फोड़े गए सामान',
      bubblesPopped: 'फोड़े गए बबल',
      zenMinutes: 'ली गई गहरी सांसें',
      worldwideTotal: '140 देशों में 24 लाख से अधिक लोगों ने तनाव दूर किया।',
      shareBtn: 'दोस्तों को शेयर करें',
      copied: 'लिंक कॉपी हो गया! किसी परेशान दोस्त को भेजो।',
    },
  },
  es: {
    appName: 'SmashChill',
    tagline: 'Destruye tu estrés. Encuentra tu calma.',
    modes: {
      rage: 'Sala de Furia',
      rant: 'Triturador',
      bubble: 'Burbujas',
      zenPond: 'Estanque Zen',
      breath: 'Respiración',
      soap: 'Corte ASMR',
    },
    rage: {
      title: 'Cámara de Destrucción',
      subtitle: 'Haz clic y destruye monitores, tazas y teléfonos con físicas reales.',
      selectTool: 'Elige Arma',
      selectTarget: 'Elige Objetivo',
      clickToSmash: '¡Haz clic para golpear!',
      combo: 'COMBO DE IRA',
      smashed: '¡DESTRUIDO!',
      repair: 'Nuevo Objeto',
      autoHeal: 'Reiniciar',
      hp: 'Resistencia',
      screenShake: 'Sacudida de pantalla',
    },
    rant: {
      title: 'Triturador de Desahogo',
      subtitle: 'Escribe lo que arruinó tu día y destrúyelo para siempre.',
      placeholder: 'Desahógate aquí... (jefe molesto, tráfico, llamadas innecesarias...)',
      presetsTitle: 'Disparadores rápidos:',
      presets: [
        'Correo urgente el viernes a las 6 PM',
        'Reuniones inútiles que pudieron ser un email',
        'El internet fallando en el peor momento',
        'Gente caminando muy lento delante de mí',
        'Pensar de más a las 3 de la madrugada',
      ],
      actionShred: 'Triturar en Tiras',
      actionBurn: 'Quemar en Cenizas',
      actionRocket: 'Lanzar al Espacio',
      actionCrush: 'Aplastamiento Total',
      emptyWarning: '¡Escribe primero tu queja!',
      destroyedNotice: 'Ha desaparecido. Respira hondo. Tú tienes el control.',
    },
    bubble: {
      title: 'Papel Burbuja Infinito',
      subtitle: 'Revienta burbujas con sonido hiperrealista.',
      poppedCount: 'Burbujas Explotadas',
      resetGrid: 'Nueva Lámina',
      infiniteMode: 'Auto-Recarga',
    },
    zen: {
      title: 'Estanque Ondulante',
      subtitle: 'Toca el agua para crear ondas y campanadas relajantes.',
      dragInstructions: 'Desliza sobre el agua para crear ondas sonoras',
      chimesNotice: 'Afinado en armonía pentatónica',
      resetPond: 'Calmar Agua',
    },
    breath: {
      title: 'Esfera de Respiración',
      subtitle: 'Calma tu ritmo cardíaco y mente en 2 minutos.',
      inhale: 'Inhala Profundo...',
      hold: 'Mantén el Aire...',
      exhale: 'Exhala Despacio...',
      cyclesDone: 'Ciclos Completados',
      mode478: 'Relajación 4-7-8',
      modeBox: 'Enfoque Cuadrado',
      start: 'Iniciar',
      pause: 'Pausar',
    },
    soap: {
      title: 'Corte de Jabón ASMR',
      subtitle: 'Corta cubos suaves con sonido crujiente.',
      dragToCut: 'Arrastra la cuchilla para rebanar',
      resetBar: 'Barra Nueva',
      cubesLeft: 'Cubos Restantes',
    },
    stats: {
      title: 'Contador Global',
      stressDestroyed: 'Estrés Eliminado',
      itemsSmashed: 'Objetos Rotos',
      bubblesPopped: 'Burbujas Rótulas',
      zenMinutes: 'Respiraciones Calmas',
      worldwideTotal: 'Más de 2.4M personas relajadas en 140 países.',
      shareBtn: 'Compartir Alivio',
      copied: '¡Enlace copiado!',
    },
  },
  ja: {
    appName: 'SmashChill',
    tagline: 'ストレスを破壊し、心の静けさを取り戻す。',
    modes: {
      rage: '破壊部屋',
      rant: '怒りシュレッダー',
      bubble: 'プチプチ',
      zenPond: '波紋の池',
      breath: '深呼吸',
      soap: 'ASMRカット',
    },
    rage: {
      title: 'ストレス破壊チェンバー',
      subtitle: 'ハンマーやバットで理不尽なものを粉砕してスッキリ！',
      selectTool: '武器を選ぶ',
      selectTarget: 'ターゲットを選ぶ',
      clickToSmash: 'クリック・タップして粉砕！',
      combo: '怒りコンボ',
      smashed: '木っ端微塵！',
      repair: '新しいアイテム',
      autoHeal: 'リセット',
      hp: '耐久値',
      screenShake: '画面の揺れ',
    },
    rant: {
      title: '愚痴シュレッダー＆焼却炉',
      subtitle: 'イライラすることを書いて、跡形もなく消し去りましょう。',
      placeholder: 'イライラをここにぶちまけてください...（上司の理不尽、満員電車、テストのプレッシャーなど）',
      presetsTitle: 'よくあるイライラ:',
      presets: [
        '金曜日の退勤間際に入った急ぎの仕事',
        'メールで済むはずの長電話や無駄な会議',
        '大事な瞬間に切れるWi-Fi回線',
        '歩きスマホで前を塞ぐ遅い人',
        '深夜3時に始まってしまう後悔と反省会',
      ],
      actionShred: 'シュレッダーで裁断',
      actionBurn: '炎で燃やし尽くす',
      actionRocket: '宇宙へロケット追放',
      actionCrush: 'プレス機で粉砕',
      emptyWarning: 'まず消したい怒りを書いてください！',
      destroyedNotice: '消滅しました。深呼吸して、自分を取り戻しましょう。',
    },
    bubble: {
      title: '無限プチプチ',
      subtitle: '心地よい破裂音でストレス解消。',
      poppedCount: '潰した数',
      resetGrid: '新品シート',
      infiniteMode: '自動補充',
    },
    zen: {
      title: '静寂の日本庭園の水面',
      subtitle: '指を滑らせて波紋と和音の音色を楽しんでください。',
      dragInstructions: '水面をなぞると波紋と心地よい和音（ペンタトニック）が響きます',
      chimesNotice: '心を整える五音音階',
      resetPond: '水面を静める',
    },
    breath: {
      title: '4-7-8 マインドフルネス呼吸',
      subtitle: '2分で自律神経を整え、心をリセット。',
      inhale: '深く息を吸って...',
      hold: '息を止めて...',
      exhale: 'ゆっくり息を吐き出す...',
      cyclesDone: '完了セット',
      mode478: '4-7-8 安眠・脱力',
      modeBox: '4-4-4 ボックス呼吸',
      start: '開始',
      pause: '一時停止',
    },
    soap: {
      title: 'ASMR 石鹸カッティング',
      subtitle: '刃を滑らせて、サクサクとブロックを削り落とす。',
      dragToCut: '刃をスライドしてカット',
      resetBar: '新しいブロック',
      cubesLeft: '残りブロック',
    },
    stats: {
      title: '世界のリラックス状況',
      stressDestroyed: '破壊されたストレス量',
      itemsSmashed: '粉砕されたアイテム',
      bubblesPopped: '潰されたプチプチ',
      zenMinutes: '整えられた呼吸回数',
      worldwideTotal: '世界140カ国で240万人以上が心を回復。',
      shareBtn: '癒しをシェア',
      copied: 'リンクをコピーしました！',
    },
  },
  de: {
    appName: 'SmashChill',
    tagline: 'Zerstöre deinen Stress. Finde deine Ruhe.',
    modes: {
      rage: 'Wutraum',
      rant: 'Frust-Schredder',
      bubble: 'Luftpolsterfolie',
      zenPond: 'Zen-Teich',
      breath: 'Atemübung',
      soap: 'ASMR Schnitt',
    },
    rage: {
      title: 'Zerstörungskammer',
      subtitle: 'Zertrümmere Drucker, Monitore und Handys mit echter Physik.',
      selectTool: 'Werkzeug wählen',
      selectTarget: 'Ziel wählen',
      clickToSmash: 'Klicken zum Zerschlagen!',
      combo: 'WUT-KOMBO',
      smashed: 'ZERTRÜMMERT!',
      repair: 'Neues Objekt',
      autoHeal: 'Zurücksetzen',
      hp: 'Haltbarkeit',
      screenShake: 'Bildschirmwackeln',
    },
    rant: {
      title: 'Frust-Schredder & Verbrenner',
      subtitle: 'Schreibe auf, was dich nervt, und vernichte es für immer.',
      placeholder: 'Schreibe deinen Frust hier auf... (nerviger Chef, Stau, schlechtes Internet...)',
      presetsTitle: 'Schnellauswahl:',
      presets: [
        'Dringende E-Mail am Freitag um 17:55 Uhr',
        'Meetings, die eine kurze Mail hätten sein können',
        'WLAN-Ausfall während wichtiger Konferenz',
        'Leute, die mitten im Gang trödeln',
        'Gedankenkarussell nachts um 3 Uhr',
      ],
      actionShred: 'In Streifen schreddern',
      actionBurn: 'Zu Asche verbrennen',
      actionRocket: 'Ins Weltall schießen',
      actionCrush: 'Hydraulisch zerquetschen',
      emptyWarning: 'Bitte schreibe zuerst deinen Frust auf!',
      destroyedNotice: 'Es ist weg. Tief durchatmen. Du hast die Kontrolle.',
    },
    bubble: {
      title: 'Endlose Luftpolsterfolie',
      subtitle: 'Platze Bläschen mit knackigem Haptik-Sound.',
      poppedCount: 'Geplatzte Bläschen',
      resetGrid: 'Neuer Bogen',
      infiniteMode: 'Automatisches Auffüllen',
    },
    zen: {
      title: 'Ruhiger Wellenteich',
      subtitle: 'Bewege den Zeiger für beruhigende Wasserwellen und Glockenklänge.',
      dragInstructions: 'Über das Wasser streichen für Wellen & Harmonien',
      chimesNotice: 'Gestimmte pentatonische Harmonie',
      resetPond: 'Wasser beruhigen',
    },
    breath: {
      title: 'Atem-Sphäre',
      subtitle: 'Beruhige dein Nervensystem in 2 Minuten.',
      inhale: 'Tief einatmen...',
      hold: 'Atem anhalten...',
      exhale: 'Langsam ausatmen & loslassen...',
      cyclesDone: 'Abgeschlossene Zyklen',
      mode478: '4-7-8 Entspannung',
      modeBox: '4-4-4 Box-Methode',
      start: 'Starten',
      pause: 'Pause',
    },
    soap: {
      title: 'ASMR Seifen-Hobeln',
      subtitle: 'Gleite mit der Klinge über die Blöcke für knusprigen Klang.',
      dragToCut: 'Klinge über die Blöcke ziehen',
      resetBar: 'Neuer Seifenblock',
      cubesLeft: 'Verbleibende Blöcke',
    },
    stats: {
      title: 'Weltweiter Zähler',
      stressDestroyed: 'Abgebauter Stress',
      itemsSmashed: 'Zerstörte Gegenstände',
      bubblesPopped: 'Geplatzte Bläschen',
      zenMinutes: 'Ruhige Atemzüge',
      worldwideTotal: 'Über 2,4 Mio. Menschen in 140 Ländern beruhigt.',
      shareBtn: 'Stressabbau teilen',
      copied: 'Link kopiert!',
    },
  },
  fr: {
    appName: 'SmashChill',
    tagline: 'Détruisez le stress. Retrouvez votre sérénité.',
    modes: {
      rage: 'Salle de Rage',
      rant: 'Déchiqueteuse',
      bubble: 'Papier Bulle',
      zenPond: 'Bassin Zen',
      breath: 'Respiration',
      soap: 'Découpe ASMR',
    },
    rage: {
      title: 'Chambre de Destruction',
      subtitle: 'Pulvérisez ordinateurs, tasses et téléphones avec physique réaliste.',
      selectTool: 'Arme',
      selectTarget: 'Cible',
      clickToSmash: 'Cliquez pour frapper !',
      combo: 'COMBO DE RAGE',
      smashed: 'PULVÉRISÉ !',
      repair: 'Nouvel Objet',
      autoHeal: 'Réinitialiser',
      hp: 'Durabilité',
      screenShake: 'Secousse d’écran',
    },
    rant: {
      title: 'Déchiqueteuse & Incinérateur',
      subtitle: 'Écrivez ce qui vous agace et détruisez-le pour toujours.',
      placeholder: 'Videz votre sac ici... (embouteillages, réunions inutiles, stress...)',
      presetsTitle: 'Exemples fréquents :',
      presets: [
        'E-mail urgent le vendredi à 18h',
        'Réunion qui aurait pu être un e-mail',
        'Wi-Fi qui coupe au pire moment',
        'Les gens qui marchent trop lentement devant soi',
        'Ruminer à 3 heures du matin',
      ],
      actionShred: 'Broyer en lamelles',
      actionBurn: 'Brûler en cendres',
      actionRocket: 'Expédier dans l’espace',
      actionCrush: 'Écrasement hydraulique',
      emptyWarning: 'Écrivez d’abord votre frustration !',
      destroyedNotice: 'C’est terminé. Respirez profondément. Tout va bien.',
    },
    bubble: {
      title: 'Papier Bulle Infini',
      subtitle: 'Éclatez des bulles avec un son ASMR parfait.',
      poppedCount: 'Bulles Éclatées',
      resetGrid: 'Nouvelle Feuille',
      infiniteMode: 'Recharge Auto',
    },
    zen: {
      title: 'Bassin d’Eau Zen',
      subtitle: 'Touchez l’eau pour former des ondulations et des cloches relaxantes.',
      dragInstructions: 'Glissez sur l’eau pour créer ondulations et carillons',
      chimesNotice: 'Harmonie pentatonique apaisante',
      resetPond: 'Apaiser l’eau',
    },
    breath: {
      title: 'Guide Respiratoire',
      subtitle: 'Apaisez votre rythme cardiaque en 2 minutes.',
      inhale: 'Inspirez profondément...',
      hold: 'Retenez votre souffle...',
      exhale: 'Expirez lentement & relâchez...',
      cyclesDone: 'Cycles Terminés',
      mode478: 'Relaxation 4-7-8',
      modeBox: 'Respiration Carrée',
      start: 'Démarrer',
      pause: 'Pause',
    },
    soap: {
      title: 'Découpe Savon ASMR',
      subtitle: 'Tranchez les cubes avec un son net et satisfaisant.',
      dragToCut: 'Glissez la lame pour découper',
      resetBar: 'Nouveau Savon',
      cubesLeft: 'Cubes Restants',
    },
    stats: {
      title: 'Soulagement Mondial',
      stressDestroyed: 'Stress Évacué',
      itemsSmashed: 'Objets Brisés',
      bubblesPopped: 'Bulles Éclatées',
      zenMinutes: 'Respirations Sereines',
      worldwideTotal: 'Plus de 2,4 millions de personnes apaisées dans 140 pays.',
      shareBtn: 'Partager l’Anti-Stress',
      copied: 'Lien copié !',
    },
  },
};
