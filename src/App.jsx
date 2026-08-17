import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Sun, Moon, Compass, GraduationCap, BookOpen, ArrowRight, User, Sparkles, Cpu, Target, Award, CheckCircle, Zap, Users, BarChart3, Globe, Menu, X, BookMarked, LogOut, Mail, Lock, PlayCircle, Info, LayoutGrid, Edit3, FolderOpen, FileText, Download, Bot, Image as ImageIcon } from 'lucide-react';

const themeStyles = {
  light: { bg: '#f8fafc', cardBg: '#ffffff', text: '#0f172a', subText: '#64748b', accent: '#2563eb', border: '1px solid #e2e8f0', inputBg: '#f1f5f9', gridColor: '#e2e8f0', axisColor: '#64748b', headerBg: '#ffffff', success: '#10b981', menuBg: '#ffffff' },
  dark: { bg: '#0b0f19', cardBg: '#1e293b', text: '#f8fafc', subText: '#94a3b8', accent: '#38bdf8', border: '1px solid #334155', inputBg: '#0f172a', gridColor: '#334155', axisColor: '#94a3b8', headerBg: '#0f172a', success: '#10b981', menuBg: '#1e293b' },
  nomad: { bg: '#f0f5f3', cardBg: '#ffffff', text: '#112211', subText: '#4e655d', accent: '#0d9488', border: '1px solid #cbdcd5', inputBg: '#e6f0ec', gridColor: '#ccdbd5', axisColor: '#4e655d', headerBg: '#112d24', success: '#0d9488', menuBg: '#ffffff' }
};

const competencyData = [
  { skill: 'Цифрлық дағдылар (AI & VR)', baseline: 0, current: 0 },
  { skill: 'Тарихи-сынау талдауы', baseline: 0, current: 0 },
  { skill: 'Инновациялық әдістеме', baseline: 0, current: 0 },
  { skill: 'Коммуникациялық дағды', baseline: 0, current: 0 },
  { skill: 'Педагогикалық менеджмент', baseline: 0, current: 0 }
];

const literatureList = [
  { id: 1, author: "Kapp, K. M. (2012)", title: "The gamification of learning and instruction", desc: "Геймификация негіздері және оқушының ішкі мотивациясын арттыру стратегиялары." },
  { id: 2, author: "Караваев Н.Л., Соболева Е.В. (2019)", title: "Совершенствование методологии геймификации в цифровой среде", desc: "Цифрлық ортадағы динамикалық статистика мен білім беру бейдждері." },
  { id: 3, author: "Глизбург В.И., Самойлова Е.С. (2016)", title: "Образовательный квест как средство формирования информационной культуры", desc: "Тарихи ізденіс (web-quest) технологияларын сабақта қолдану." },
  { id: 4, author: "Ы. Алтынсарин атындағы ҰБА (2024)", title: "Формативті бағалауды жүзеге асыру бойынша нұсқаулық", desc: "Қазақстандық стандартқа сай формативті бағалау өлшемдері." },
  { id: 5, author: "Shavab, O. A. K., et al. (2023)", title: "Fostering Creative Thinking Through Gamification in History Learning", desc: "Тарих сабағында креативті ойлауды ойын арқылы дамыту тәжірибесі." },
  { id: 6, author: "Villena-Taranilla, R., Diago, P. D. (2025)", title: "Challenges and Implications of Virtual Reality in History Education", desc: "Тарихи кеңістікті VR көмегімен қабылдаудың когнитивті ерекшеліктері." },
  { id: 7, author: "Алексеева А.З., және т.б. (2021)", title: "Геймификация в образовании", desc: "Мұғалімнің фасилитаторлық рөлі және оқу процесін басқару." },
  { id: 8, author: "Mishra, P., & Koehler, M. J. (2006)", title: "Technological Pedagogical Content Knowledge (TPACK)", desc: "Технология, педагогика және пәндік мазмұнды біріктірудің іргелі моделі." },
  { id: 9, author: "Wineburg, S. (2001)", title: "Historical Thinking and Other Unnatural Acts", desc: "Оқушыларды тарихи деректермен сыни тұрғыдан жұмыс істеуге үйрету." },
  { id: 10, author: "Vygotsky, L. S. (1978)", title: "Mind in society: The development of higher psychological processes", desc: "Жақын даму аймағы (ZPD) және әлеуметтік-конструктивті оқыту." },
  { id: 11, author: "Deterding, S., et al. (2011)", title: "From game design elements to gamefulness", desc: "Ойын элементтерін білім беру мақсатында бейімдеу алгоритмдері." },
  { id: 12, author: "Hamari, J., et al. (2014)", title: "Does gamification work? A literature review", desc: "Геймификацияның эмпирикалық тиімділігін дәлелдейтін мета-анализ." },
  { id: 13, author: "Шоган В.В. (2007)", title: "Методика преподавания истории в школе: новая технология", desc: "Тұлғаға бағдарланған тарихи білім беру және интерактивті сабақтар." },
  { id: 14, author: "Қойгелдиев М.Қ. (2015)", title: "Тарих тағылымы және қазіргі заман", desc: "Отандық тарихнаманы оқытудағы ұлттық таным мен құндылықтар." },
  { id: 15, author: "Lee, E. A. L., & Wong, K. W. (2014)", title: "Learning with desktop virtual reality", desc: "Кеңістіктік қабілеті төмен оқушыларға VR технологиясының оң әсері." },
  { id: 16, author: "Hwang, G. J., et al. (2020)", title: "A vision of the metaverse in education", desc: "Метағалам (Metaverse) мүмкіндіктерін тарихи реконструкцияда қолдану." },
  { id: 17, author: "ҚР Оқу-ағарту министрлігі (2022)", title: "Тарих пәнін оқытудың заманауи әдістемелері (Нұсқаулық)", desc: "Жаңартылған білім беру мазмұны аясындағы инновациялық тәсілдер." },
  { id: 18, author: "Hattie, J. (2008)", title: "Visible learning: A synthesis of over 800 meta-analyses", desc: "Оқушы жетістігіне кері байланыс (feedback) пен мұғалімнің әсерін бағалау." },
  { id: 19, author: "Koster, R. (2013)", title: "Theory of Fun for Game Design", desc: "Когнитивті психология тұрғысынан ойынның миды жаттықтыру механизмі." },
  { id: 20, author: "McGonigal, J. (2011)", title: "Reality is broken: Why games make us better", desc: "Эпикалық мақсаттар қою арқылы оқушының табандылығын арттыру." }
];

const questScenarios = [
  {
    id: 1,
    title: 'Ұлы Жібек жолы: керуен жолындағы келіссөз',
    grade: '6-сынып',
    subject: 'Дүниежүзі тарихы',
    color: '#3b82f6',
    desc: 'Оқушылар сауда керуенінің қатысушылары ретінде рөлге еніп, кедендік бажы мен қауіпсіздік туралы келіссөз жүргізеді.',
    roles: [
      { name: 'Соғды саудагері', desc: 'Жібек пен дәмдеуіштерді сатуға тырысасың, бажды азайтуды талап етесің.' },
      { name: 'Түрік қағанатының салық жинаушысы', desc: 'Керуеннен өтетін баж салығын белгілейсің, керуеннің қауіпсіздігін қамтамасыз етесің.' },
      { name: 'Қытай императорының елшісі', desc: 'Императордың атынан одақтастық пен ұзақ мерзімді сауда келісімін ұсынасың.' }
    ],
    quest: [
      { title: '1-хат: керуен шекараға жетті', content: 'Керуен қаған иелігінің шекарасына жетті. Салық жинаушы жолды бөгеп тұр — өз рөліңе сай алғашқы сөзіңді айт.' },
      { title: '2-хат: келіссөз басталды', content: 'Әр рөл өз мүддесін қорғап, ортақ шешімге келуі керек. Топқа 10 минут уақыт беріледі.' },
      { title: '3-хат: қорытынды келісім', content: 'Топ өз шешімін тақтаға жазып, неге дәл осылай шешкенін тарихи фактілермен дәлелдейді.' }
    ]
  },
  {
    id: 2,
    title: 'Түрік қағанатының елшілік миссиясы',
    grade: '6-сынып',
    subject: 'Қазақстан тарихы',
    color: '#10b981',
    desc: 'Оқушылар көрші мемлекеттерге аттандырылған елшілер ретінде одақтастық іздейді.',
    roles: [
      { name: 'Түрік қағанатының елшісі', desc: 'Одақтастық ұсынасың, қағанның сыйлықтарын әкелесің.' },
      { name: 'Византия императорының кеңесшісі', desc: 'Одақтың пайдасы мен қауіп-қатерін бағалайсың.' },
      { name: 'Соғды дипломаты', desc: 'Екі жаққа да сауда мүддесін түсіндіресің, делдал рөлін атқарасың.' }
    ],
    quest: [
      { title: '1-хат', content: 'Қаған сізді Византияға аттандырды. Жол қиын, бірақ миссия маңызды.' },
      { title: '2-хат', content: 'Император сарайында сынақ сұрақтары қойылады — рөліңе сай жауап беруің керек.' },
      { title: '3-хат', content: 'Одақ келісімінің шарттарын дайындап, топ алдында қорғаңыз.' }
    ]
  },
  {
    id: 3,
    title: 'Бөкей Ордасы: хан кеңесінің отырысы',
    grade: '8-сынып',
    subject: 'Қазақстан тарихы',
    color: '#f59e0b',
    desc: 'Оқушылар 1827 жылғы хан кеңесінің билері ретінде жайылым дауын шешеді.',
    roles: [
      { name: '1-ру биі', desc: 'Өз руыңның жер құқығын қорғайсың, дәлелдер келтіресің.' },
      { name: '2-ру биі', desc: 'Қарсы тараптың талабына жауап бересің, өз позицияңды қорғайсың.' },
      { name: 'Хан кеңесінің төрағасы', desc: 'Екі жақты тыңдап, «Жеті Жарғы» негізінде әділ шешім қабылдайсың.' }
    ],
    quest: [
      { title: '1-хат', content: 'Екі ру арасында жайылым үшін дау туды, бір адам жарақат алды.' },
      { title: '2-хат', content: 'Билер дәлел келтіреді, куәгерлер тыңдалады.' },
      { title: '3-хат', content: 'Кеңес түпкілікті шешімін жариялайды және оны негіздейді.' }
    ]
  }
];

const historicalDilemmas = [
  {
    id: 1,
    title: 'Әбілқайыр ханның 1731 жылғы таңдауы',
    grade: '8-сынып',
    subject: 'Қазақстан тарихы',
    color: '#8b5cf6',
    situation: '1731 жыл. Жоңғар шапқыншылығы күшейіп, қазақ жерлері үнемі шабуылға ұшырап жатыр.',
    problem: 'Әбілқайыр ханның алдында үш жол бар: жалғыз күресуді жалғастыру, Ресей империясының қол астына кіру, немесе басқа көшпелі мемлекеттермен әскери одақ құру.',
    options: [
      'Ресей империясының протекторатына кіру',
      'Жоңғарға қарсы жалғыз күресуді жалғастыру',
      'Қоқан/Хиуамен уақытша әскери одақ құру'
    ],
    guidingQuestions: [
      'Әр таңдаудың қысқа мерзімді және ұзақ мерзімді салдары қандай болар еді?',
      'Хан халық мүддесі мен өз билігі арасында қалай тепе-теңдік сақтауы керек?',
      'Осы шешімнің қазіргі Қазақстан тарихына қалай әсер еткенін көреміз?'
    ]
  },
  {
    id: 2,
    title: 'Кенесары ханның 1837 жылғы дилеммасы',
    grade: '8-сынып',
    subject: 'Қазақстан тарихы',
    color: '#ef4444',
    situation: 'Ресейдің отарлау саясаты күшейіп, қазақ даласында бекіністер салынып жатыр.',
    problem: 'Кенесары ашық қарулы көтеріліс жасау немесе дипломатиялық жолмен келіссөз жүргізу арасында таңдау жасауы керек.',
    options: [
      'Қарулы көтеріліс бастау',
      'Ресеймен келіссөзге отыру',
      'Халықты көшіріп, шетелге кету'
    ],
    guidingQuestions: [
      'Қарулы күрестің қандай тәуекелдері болды?',
      'Дипломатия неге сол кезде қиын болды?',
      'Көтерілістің тарихи маңызы неде?'
    ]
  },
  {
    id: 3,
    title: 'Т. Рысқұлов пен 1920-жылдардағы таңдау',
    grade: '9-сынып',
    subject: 'Қазақстан тарихы',
    color: '#0d9488',
    situation: 'Кеңес өкіметі орнап, ұлт зиялылары жаңа билікпен қарым-қатынас орнату керек пе деген сұраққа тап болды.',
    problem: 'Кеңес аппаратында жұмыс істеп, ішінен реформа жасауға тырысу, немесе ашық қарсылық көрсету арасында таңдау керек.',
    options: [
      'Кеңес аппаратында жұмыс істеп, ұлттық мүддені ішінен қорғау',
      'Ашық қарсылық көрсету',
      'Шетелге эмиграцияға кету'
    ],
    guidingQuestions: [
      'Ынтымақтастықтың қандай тәуекелі болды?',
      'Тарих осы таңдаудың салдарын қалай бағалайды?',
      'Ұлт зиялыларының рөлі қоғамда қандай болуы керек?'
    ]
  }
];

const methodologyFiles = [
  { id: 1, type: 'ҚМЖ', grade: '6-сынып', subject: 'Қазақстан тарихы', title: 'Түрік қағанатының құрылуы', desc: 'Блум таксономиясы мен геймификация элементтері енгізілген 45 минуттық идеалды сабақ жоспары.', format: 'PDF', color: '#3b82f6' },
  { id: 2, type: 'КТЖ', grade: '6-сынып', subject: 'Қазақстан тарихы', title: '2025-2026 оқу жылына арналған КТЖ', desc: 'Ы. Алтынсарин атындағы ҰБА нұсқау хаты негізінде жасалған күнтізбелік-тақырыптық жоспар үлгісі.', format: 'DOCX', color: '#10b981' },
  { id: 3, type: 'БЖБ / ТЖБ', grade: '8-сынып', subject: 'Дүниежүзі тарихы', title: 'Өнеркәсіп төңкерісі бөлімі бойынша БЖБ', desc: 'Критериалды бағалау рубрикалары, оқу мақсаттары мен дескрипторлар жиынтығы.', format: 'PDF', color: '#f59e0b' },
  { id: 4, type: 'ҚМЖ', grade: '8-сынып', subject: 'Дүниежүзі тарихы', title: 'АҚШ-тағы Азамат соғысы', desc: 'VR технологиясы мен сыни ойлауды дамытуға бағытталған сабақ жоспары.', format: 'PDF', color: '#3b82f6' },
  { id: 5, type: 'Нұсқаулық', grade: 'Жалпы', subject: 'Педагогика', title: 'Сабақ мақсаттарын дұрыс қою', desc: 'SMART форматы мен Блум таксономиясының етістіктерін тарих сабағында қолдану шпаргалкасы.', format: 'PDF', color: '#8b5cf6' }
];

const historicalSources = [
  { id: 1, category: 'Заттай дерек', name: 'Күлтегін ескерткіші (Руна жазулары)', desc: 'Тастағы қашалған мәтіндер арқылы Түрік қағанатының саяси тарихы мен наным-сенімін зерттеу.', tag: '6-сынып', color: '#f59e0b', pedagogy: 'Оқушыларға дайын мәтінді бермей, руна таңбаларының суретін көрсетіңіз. "Бұл тастағы жазулар кімге арналуы мүмкін? Олар неге қағазға емес, тасқа қашалған?" деген ашық сұрақтар арқылы миға шабуыл жасаңыз.', task: 'Оқушыларды "эпиграфист-ғалымдар" рөліне енгізіп, Күлтегін жырының бір үзіндісін беріп, сол кездегі түркілердің басты құндылығы не болғанын (ел, жер, ерлік) анықтатыңыз.' },
  { id: 2, category: 'Жазба дерек', name: '«Жеті Жарғы» заңдар жинағы', desc: 'Тәуке ханның кезіндегі қазақ қоғамының әлеуметтік-құқықтық нормаларын талдау.', tag: '8-сынып', color: '#3b82f6', pedagogy: 'Заң баптарын жаттатпаңыз. Case-study (жағдаяттық талдау) әдісін қолданыңыз. Оқушыларға ортағасырлық даулы ситуацияны беріп, оны "Жеті Жарғы" негізінде шешуді тапсырыңыз.', task: '"Екі рудың арасында жайылым үшін дау туды. Бір адам жарақат алды. Билер соты бұл мәселені Жеті Жарғының қай бабымен шешеді?" деген жағдаятты талдатыңыз.' },
  { id: 3, category: 'Картография', name: 'Махмұд Қашқаридың «Дөңгелек картасы»', desc: 'ХІ ғасырдағы түркі тайпаларының орналасуы мен дүниетанымын кеңістіктік талдау.', tag: '7-сынып', color: '#10b981', pedagogy: 'Картаны заманауи Google Maps-пен салыстыру әдісін қолданыңыз. Оқушыларға картаның ортасында неге Баласағұн қаласы (немесе Ыстықкөл) тұрғанын сұрап, ортағасырлық дүниетанымды түсіндіріңіз.', task: 'Картадағы түстерге (таулар – қызыл, теңіздер – жасыл) мән бергізіп, қазіргі Қазақстан аумағындағы тайпалардың мекенін тапқызыңыз.' }
];

const historicalVisuals = [
  { id: 1, category: 'Жәдігер', name: 'Алтын адам (Есік қорғаны)', desc: 'Сақ дәуірінің киім үлгісін заманауи 3D-реконструкция арқылы қайта саралау.', color: '#f59e0b', imgUrl: 'https://images.unsplash.com/photo-1608501078713-8e445a709b39?q=80&w=800&auto=format&fit=crop', source: 'Есік қорғанынан табылған, б.з.д. V-IV ғ.', script: 'Мұражайда жатқан 4000-ға жуық алтын тақташадан құралған сақ киімі — статикалық жәдігер.', remake: 'AI арқылы қалпына келтірілген киімді 3D айналдырып, сақ жауынгерінің қимылын, атқа қалай мінгенін оқушыларға көрсетуге болады.' },
  { id: 2, category: 'Жазба ескерткіш', name: 'Орхон-Енисей жазулары', desc: 'Көне түркі руна жазуларын дауыстап "тірілту" арқылы тілдік деректануды тереңдету.', color: '#3b82f6', imgUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=800&auto=format&fit=crop', source: 'Күлтегін, Тоныкөк ескерткіштері, VIII ғ.', script: 'Тастағы қашалған таңбалар — оқушыға түсініксіз, статикалық символдар қатары.', remake: 'AI дыбыстық синтезі арқылы жазудың көне түркі тілінде қалай естілгенін оқушылар тыңдап, мағынасын салыстырып көреді.' },
  { id: 3, category: 'Сәулет', name: 'Түркістандағы Қожа Ахмет Ясауи кесенесі', desc: 'Әмір Темір дәуіріндегі құрылыс технологиясын AI-анимация арқылы қабаттап көрсету.', color: '#10b981', imgUrl: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?q=80&w=800&auto=format&fit=crop', source: 'XIV ғасыр, Әмір Темірдің тапсырысымен салынған.', script: 'Оқулықтағы фото — дайын, аяқталған ғимарат, құрылыс кезеңдері көрінбейді.', remake: 'AI анимациясы ғимараттың негізінен күмбезіне дейін қабат-қабат қалай тұрғызылғанын көрсетеді, сол дәуірдің инженерлік шешімдерін ашады.' }
];

const innovativeMethods = [
  { id: 1, category: 'Сыни Пікірталас (Дебат)', name: 'Әмір Темірдің жорықтарын талдау', desc: 'Хронологиялық қателерді табу және фактчекинг арқылы оқушының сыни ойлауын дамыту.', fact: 'Орта Азияны жаулап алу және біріктіру процесі 35 жыл емес, нақты 18 жылға созылды.', application: 'Оқушыларды екі топқа бөлу. Бір топқа бұрынғы "35 жылдық" мифті, екінші топқа нақты "18 жылдық" хронологияны дәлелдету. Дереккөздерді салыстыру арқылы тарихи анализ жасату.', color: '#8b5cf6' },
  { id: 2, category: 'Case-Study (Жағдаят)', name: 'Бөкей Ордасының Хан кеңесі (1827 ж.)', desc: 'Мұрағат құжаттарына сүйеніп, қате деректерді жоққа шығару және саяси құрылымды талдау.', fact: 'Кеңес құрамында 72 "бай-старшын" емес, нақты 12 би болған.', application: 'Оқушыларға 1827 жылғы кеңес отырысының ситуациясын (кейсін) беру. 72 адам туралы қате мәліметтің қайдан шыққанын зерттетіп, шешімді неліктен тек 12 би қабылдағанын талқылау.', color: '#f59e0b' },
  { id: 3, category: 'Жобалап оқыту (PBL)', name: 'Қазақ хандығының құрылған жылы', desc: 'Күнтізбелік жүйелерді (Хижра және Григориан) конвертациялау арқылы зерттеу жүргізу.', fact: 'Мұхаммед Хайдар Дулатидың «Тарих-и-Рашиди» еңбегінде хандықтың құрылуы Хижра бойынша 870 жыл деп көрсетілген.', application: 'Оқушыларға Хижра жылын қазіргі жыл санауға айналдыру формуласын ұсынып, 870 жылдың 1465-1466 жылдарға қалай сәйкес келетінін дәлелдейтін шағын зерттеу жобасын жасату.', color: '#10b981' }
];

const courseModules = [
  {
    id: 1,
    title: "Модуль 1: Тарихи танымдағы Геймификация",
    desc: "Ойын элементтерін қолдану арқылы тарих сабағында мотивацияны арттыру",
    reflectionQuestion: "Осы модульдегі геймификация әдістерін өзіңіздің тарих сабағыңызда нақты қалай қолданар едіңіз?",
    questions: [
      { scenario: "1. Сіз 6-сыныпқа «Түрік қағанаты» тақырыбын түсіндіріп жатсыз. Оқушылардың назары шашыраңқы. Олардың ішкі мотивациясын ояту үшін қандай әдіс қолданасыз?", options: [{ text: "Мәтінді бірнеше рет дауыстап оқытып, маңызды даталарды жаттатамын.", points: { 'Инновациялық әдістеме': 10, 'Педагогикалық менеджмент': 20 } }, { text: "Оқушыларды топқа бөліп, Түрік қағанатының елшілері ретінде көрші елдермен келіссөз жүргізу рөлдік квестін ұйымдастырамын.", points: { 'Инновациялық әдістеме': 85, 'Коммуникациялық дағды': 90, 'Тарихи-сынау талдауы': 75 } }], citation: "Негіздеме: Kapp (2012) және Shavab (2023) зерттеулері бойынша геймификация мен рөлдік ойындар оқушының тарихты үйренуге деген ішкі мотивациясын күрт арттырады." },
      { scenario: "2. Қағанаттың әлеуметтік құрылымын түсіндіру керек. Құрғақ сызба сызбас үшін нені таңдайсыз?", options: [{ text: "Тақтаға иерархия пирамидасын сызып беремін.", points: { 'Инновациялық әдістеме': 30 } }, { text: "«Рун жазуларын жинау» ойын механикасын енгізіп, әр дұрыс жауапқа оқушының әлеуметтік статусын «қарашадан» «бекке» дейін көтеремін.", points: { 'Инновациялық әдістеме': 90, 'Педагогикалық менеджмент': 80 } }], citation: "Негіздеме: Koster (2013) ойын механикасы миды жаттықтырып, күрделі әлеуметтік құрылымдарды тез ұғынуға көмектесетінін айтады." },
      { scenario: "3. Түрік қағанатының ыдырау себептерін өткенде, оқушылар тақырыпқа енжар қарай бастады. Олардың табандылығын қалай арттырамыз?", options: [{ text: "Тақырыпты оқымағандарға төмен баға қоямын деп ескертемін.", points: { 'Педагогикалық менеджмент': 10 } }, { text: "«Қағанатты аман алып қалу» эпикалық мақсатын қойып, тарихи фактілер негізінде альтернативті тарих жаздыртамын.", points: { 'Тарихи-сынау талдауы': 95, 'Инновациялық әдістеме': 85 } }], citation: "Негіздеме: McGonigal (2011) «эпикалық мақсаттар» оқушылардың табандылығы мен креативтілігін оятатынын дәлелдеген." }
    ]
  },
  {
    id: 2,
    title: "Модуль 2: Цифрлық құралдар (AI & VR)",
    desc: "18-19 ғасырлар тарихын оқытудағы заманауи технологиялар",
    reflectionQuestion: "Цифрлық технологиялар (VR/AI) тарих сабағындағы когнитивті жүктемені азайта ма, әлде көбейте ме?",
    questions: [
      { scenario: "1. 8-сыныпта АҚШ-тағы Азамат соғысының шайқас далаларын оқушылар көз алдына елестете алмады. Мәселені қалай шешесіз?", options: [{ text: "Оқулықтағы 2D карталарды пайдаланып, шайқас бағыттарын сызып көрсетемін.", points: { 'Инновациялық әдістеме': 30, 'Педагогикалық менеджмент': 50 } }, { text: "VR-көзілдіріктер арқылы виртуалды реконструкциясына кеңістіктік саяхат жасаймын.", points: { 'Цифрлық дағдылар (AI & VR)': 95, 'Инновациялық әдістеме': 90 } }], citation: "Негіздеме: Villena-Taranilla (2025) VR технологиясы тарих сабағында кеңістіктік-иммерсивті қабылдауды жоғарылататынын дәлелдейді." },
      { scenario: "2. Өнеркәсіп төңкерісі туралы сабақта AI құралдарын қалай тиімді қолданасыз?", options: [{ text: "AI арқылы сабақ жоспарын ғана жаздыртып алып, сабақты дәстүрлі түрде өтемін.", points: { 'Цифрлық дағдылар (AI & VR)': 40 } }, { text: "Оқушыларға ChatGPT арқылы фабрика жұмысшысының атынан хат жаздыртып, промпт құрастыруға үйретемін.", points: { 'Цифрлық дағдылар (AI & VR)': 90, 'Тарихи-сынау талдауы': 85 } }], citation: "Негіздеме: Mishra & Koehler (2006) TPACK моделіне сәйкес, технология тарихи мазмұнды ашуға тікелей қызмет етуі тиіс." },
      { scenario: "3. Desktop VR қолданғанда кейбір оқушылар ақпараттан шатасып кетті. Не істейсіз?", options: [{ text: "Технологияны тоқтатып, дәстүрлі қағаз картаға қайта ораламын.", points: { 'Педагогикалық менеджмент': 30 } }, { text: "Когнитивті жүктемені азайту үшін виртуалды ортадағы артық нысандарды өшіріп, бағыттаушы сұрақтар қоямын.", points: { 'Педагогикалық менеджмент': 85, 'Цифрлық дағдылар (AI & VR)': 80 } }], citation: "Негіздеме: Lee & Wong (2014) VR қолданғанда кеңістіктік қабілеті төмен оқушыларға артық ақпарат бермеу керектігін ескертеді." }
    ]
  },
  {
    id: 3,
    title: "Модуль 3: Педагогикалық менеджмент және Бағалау",
    desc: "Моңғол империясы тақырыбы негізінде формативті бағалау жүргізу",
    reflectionQuestion: "Қазіргі тарих сабағындағы формативті бағалаудың ең тиімді құралы қандай деп есептейсіз?",
    questions: [
      { scenario: "1. Моңғол империясының құрылуы бойынша Web-квест әдісін қолдандыңыз. Оқушылардың жұмысын сабақ барысында қалай бағалайсыз?", options: [{ text: "Сабақ соңында барлығына бірдей суммативті (жиынтық) тест беремін.", points: { 'Педагогикалық менеджмент': 30, 'Тарихи-сынау талдауы': 40 } }, { text: "Квесттің әр кезеңінде платформада цифрлық бейдждер беріп, көшбасшылар тақтасы арқылы формативті кері байланыс жасаймын.", points: { 'Педагогикалық менеджмент': 90, 'Цифрлық дағдылар (AI & VR)': 80 } }], citation: "Негіздеме: Ы. Алтынсарин ҰБА (2024) нұсқаулығы цифрлық ортада бейдждер арқылы динамикалық формативті бағалаудың тиімділігін көрсетеді." },
      { scenario: "2. Оқушылар «Жасақ» заңдарын талдау барысында тарихи қателіктер жіберді. Мұғалім ретіндегі сіздің реакцияңыз?", options: [{ text: "Дұрыс жауапты өзім айтып, қателерін дәптерге жаздыртамын.", points: { 'Коммуникациялық дағды': 20 } }, { text: "Тікелей жауап бермей, оларды 'Жақын даму аймағына' (ZPD) жетелейтін сұрақтар қойып, дұрыс қорытындыны өздеріне тапқызамын.", points: { 'Коммуникациялық дағды': 95, 'Педагогикалық менеджмент': 90 } }], citation: "Негіздеме: Vygotsky (1978) оқушыға дұрыс жауап бергеннен гөрі, бағыттаушы кері байланыс тиімдірек екенін дәлелдейді." },
      { scenario: "3. Моңғол империясының Еуразияға тигізген әсерін бағалау үшін оқушыларға қандай тапсырма бересіз?", options: [{ text: "Оқулықтағы параграфты оқып, конспект жасап келуді тапсырамын.", points: { 'Тарихи-сынау талдауы': 30 } }, { text: "Әртүрлі елдердің (Қытай, Араб, Еуропа) бастапқы дереккөздерін беріп, олардың көзқарастарындағы айырмашылықтарға сыни талдау жасатамын.", points: { 'Тарихи-сынау талдауы': 95, 'Коммуникациялық дағды': 85 } }], citation: "Негіздеме: Wineburg (2001) тарихи ойлауды қалыптастыру үшін қарама-қайшы тарихи құжаттармен жұмыс істету керектігін алға тартады." }
    ]
  }
];

const methodLabels = {
  jigsaw: 'Jigsaw (Ара) әдісі - Топтық зерттеу',
  flipped: 'Төңкерілген сынып (Flipped Classroom)',
  case_study: 'Case Study (Жағдаяттық талдау)',
  gamification: 'Геймификация (Рөлдік ойын)',
  debate: 'Пікірталас / Дебат',
  factcheck: 'Фактчекинг және Деректану'
};

const subjectLabels = {
  kz_history: 'Қазақстан тарихы',
  world_history: 'Дүниежүзі тарихы',
  law: 'Құқық негіздері'
};

export default function App() {
  const [currentTheme, setCurrentTheme] = useState('light');
  const [view, setView] = useState('landing');
  const [role, setRole] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [activeSourceModal, setActiveSourceModal] = useState(null);
  const [activeVisualModal, setActiveVisualModal] = useState(null);
  const [activeMethodModal, setActiveMethodModal] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [competencies, setCompetencies] = useState(competencyData);
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [activeModuleId, setActiveModuleId] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [showCitation, setShowCitation] = useState(false);
  const [reflectionText, setReflectionText] = useState('');
  const [testCompleted, setTestCompleted] = useState(false);

  // --- AI-Конструктор (ailab) күйлері ---
  const [grade, setGrade] = useState('7');
  const [subject, setSubject] = useState('kz_history');
  const [method, setMethod] = useState('jigsaw');
  const [customMethod, setCustomMethod] = useState('');
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');

  // --- Геймификация және Квест күйлері ---
  const [activeQuestId, setActiveQuestId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([
    { id: 1, name: 'Соғды саудагерлері', points: 0 },
    { id: 2, name: 'Түрік қағанаты', points: 0 },
    { id: 3, name: 'Қытай елшілігі', points: 0 }
  ]);
  const [newTeamName, setNewTeamName] = useState('');

  // --- Тарихи Case-Study базасы күйлері ---
  const [activeDilemmaId, setActiveDilemmaId] = useState(null);
  const [selectedOptionByDilemma, setSelectedOptionByDilemma] = useState({});

  const s = themeStyles[currentTheme];

  const navigateTo = (page) => {
    setView(page);
    setIsMenuOpen(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (isRegister) {
      if (role && name && email && password) {
        setView('dashboard');
      } else {
        alert("Ескерту: Тіркелу үшін барлық жолақтарды толтырыңыз!");
      }
    } else {
      if (email && password) {
        setView('dashboard');
      } else {
        alert("Ескерту: Жүйеге кіру үшін почта мен құпиясөзді енгізіңіз!");
      }
    }
  };

  const handleSocialLogin = (provider) => {
    setRole('student');
    setName(provider + ' Пайдаланушысы');
    setView('dashboard');
  };

  const startModule = (id) => {
    if (id > unlockedLevel) return;
    setActiveModuleId(id);
    setCurrentQuestionIdx(0);
    setShowCitation(false);
    setView('test');
  };

  const handleAnswer = (points) => {
    setCompetencies(prev => prev.map(comp => {
      if (points[comp.skill]) return { ...comp, current: Math.max(comp.current, points[comp.skill]) };
      return comp;
    }));
    setShowCitation(true);
  };

  const nextQuestion = () => {
    const currentModule = courseModules.find(m => m.id === activeModuleId);
    if (currentQuestionIdx < currentModule.questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setShowCitation(false);
    } else {
      setView('reflection');
      setShowCitation(false);
    }
  };

  const handleReflectionSubmit = () => {
    if (reflectionText.trim() === '') {
      alert('Ескерту: Келесі модульге өту үшін өз ойыңызды жазыңыз!');
      return;
    }
    if (activeModuleId === unlockedLevel) setUnlockedLevel(unlockedLevel + 1);
    if (activeModuleId === courseModules.length) {
      setTestCompleted(true);
      navigateTo('dashboard');
    } else {
      setReflectionText('');
      setView('modules');
    }
  };

  const handleGenerateAI = async (promptText) => {
  // Бұл жерде жүктелу (загрузка) процесін бастаймыз
  // мысалы: setIsLoading(true);

  try {
    // Vercel-ге жасырған кілтті шақырып аламыз
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY; 

    if (!apiKey) {
      alert("API кілт табылған жоқ! Vercel баптауларын тексеріңіз.");
      return;
    }

    // Gemini-ге интернет арқылы тікелей сұраныс жіберу
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ 
            text: `Сен тарих пәнінің шебер мұғалімісің әрі әдіскерсің. Мына тақырыпқа қысқа мерзімді сабақ жоспарын (ҚМЖ) құрастырып бер: ${promptText}. Жауабың нақты, құрылымды әрі қазақ тілінде болсын.` 
          }]
        }]
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates.length > 0) {
      // Gemini-ден келген нақты жауап мәтіні
      const aiText = data.candidates[0].content.parts[0].text;
      
      // Осы жерде aiText-ті экранға шығаратын State-ке саласыз
      // мысалы: setGeneratedLesson(aiText);
    } else {
      console.error("Gemini-ден қате жауап келді:", data);
    }

  } catch (error) {
    console.error("Сұраныс жіберуде қате шықты:", error);
  } finally {
    // Жүктелу процесін тоқтатамыз
    // setIsLoading(false);
  }
};

  const averageGrowth = competencies.reduce((acc, curr) => acc + curr.current, 0) > 0
    ? Math.round(competencies.reduce((acc, curr) => acc + (curr.current - curr.baseline), 0) / competencies.length)
    : 0;

  const SidebarMenu = () => (
    <>
      {isMenuOpen && <div onClick={() => setIsMenuOpen(false)} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }} />}
      <div style={{ position: 'fixed', top: 0, left: isMenuOpen ? 0 : '-320px', width: '280px', height: '100vh', backgroundColor: s.menuBg, zIndex: 1000, transition: 'left 0.3s ease', padding: '25px', boxShadow: '4px 0 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles color={currentTheme === 'nomad' ? '#f59e0b' : s.accent} size={24} />
            <span style={{ fontSize: '20px', fontWeight: '800', color: s.text }}>UstazLab</span>
          </div>
          <button onClick={() => setIsMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.subText }}><X size={24} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
          <button onClick={() => navigateTo('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: view === 'dashboard' ? s.inputBg : 'transparent', border: 'none', cursor: 'pointer', color: s.text, fontSize: '15px', fontWeight: '600', textAlign: 'left' }}><BarChart3 size={20} color={s.accent} /> Дашборд</button>
          <button onClick={() => navigateTo('modules')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: view === 'modules' ? s.inputBg : 'transparent', border: 'none', cursor: 'pointer', color: s.text, fontSize: '15px', fontWeight: '600', textAlign: 'left' }}><LayoutGrid size={20} color={s.success} /> Курс модульдері</button>
          <button onClick={() => navigateTo('ailab')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: view === 'ailab' ? s.inputBg : 'transparent', border: 'none', cursor: 'pointer', color: s.text, fontSize: '15px', fontWeight: '600', textAlign: 'left' }}><Bot size={20} color="#8b5cf6" /> AI-Конструктор ҚМЖ</button>
          <button onClick={() => navigateTo('methodology')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: view === 'methodology' ? s.inputBg : 'transparent', border: 'none', cursor: 'pointer', color: s.text, fontSize: '15px', fontWeight: '600', textAlign: 'left' }}><FolderOpen size={20} color="#8b5cf6" /> Методикалық қоржын</button>
          <button onClick={() => navigateTo('sources')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: view === 'sources' ? s.inputBg : 'transparent', border: 'none', cursor: 'pointer', color: s.text, fontSize: '15px', fontWeight: '600', textAlign: 'left' }}>
            <Compass size={20} color="#f59e0b" /> Интерактивті Деректану
          </button>
          <button onClick={() => navigateTo('methods')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: view === 'methods' ? s.inputBg : 'transparent', border: 'none', cursor: 'pointer', color: s.text, fontSize: '15px', fontWeight: '600', textAlign: 'left' }}>
            <Target size={20} color="#8b5cf6" /> Инновациялық әдістер
          </button>
          <button onClick={() => navigateTo('gamification')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: view === 'gamification' ? s.inputBg : 'transparent', border: 'none', cursor: 'pointer', color: s.text, fontSize: '15px', fontWeight: '600', textAlign: 'left' }}>
            <PlayCircle size={20} color="#3b82f6" /> Геймификация және Квест
          </button>
          <button onClick={() => navigateTo('casestudy')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: view === 'casestudy' ? s.inputBg : 'transparent', border: 'none', cursor: 'pointer', color: s.text, fontSize: '15px', fontWeight: '600', textAlign: 'left' }}>
            <Users size={20} color="#ef4444" /> Тарихи Case-Study базасы
          </button>
          <button onClick={() => navigateTo('visuals')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: view === 'visuals' ? s.inputBg : 'transparent', border: 'none', cursor: 'pointer', color: s.text, fontSize: '15px', fontWeight: '600', textAlign: 'left' }}>
            <ImageIcon size={20} color="#ef4444" /> AI Визуализация
          </button>
          <button onClick={() => navigateTo('literature')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '10px', background: view === 'literature' ? s.inputBg : 'transparent', border: 'none', cursor: 'pointer', color: s.text, fontSize: '15px', fontWeight: '600', textAlign: 'left' }}><BookMarked size={20} color="#f59e0b" /> Ғылыми әдебиеттер</button>
        </div>
        <button onClick={() => { setRole(null); setName(''); navigateTo('landing'); }} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '15px', fontWeight: '600', textAlign: 'left', marginTop: 'auto' }}><LogOut size={20} /> Жүйеден шығу</button>
      </div>
    </>
  );

  if (view === 'landing') {
    return (
      <div style={{ fontFamily: '"Inter", sans-serif', backgroundColor: s.bg, minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: '1200px', display: 'flex', justifyContent: 'flex-start', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles color={currentTheme === 'nomad' ? '#f59e0b' : s.accent} size={28} />
            <span style={{ fontSize: '24px', fontWeight: '800', color: s.text, letterSpacing: '-0.5px' }}>UstazLab</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', width: '100%', gap: '50px', marginBottom: '60px' }}>
          <div style={{ flex: '1 1 500px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: currentTheme === 'dark' ? '#1e293b' : '#eff6ff', padding: '8px 16px', borderRadius: '20px', marginBottom: '20px', border: s.border }}>
              <Sparkles color={s.accent} size={14} />
              <span style={{ fontSize: '12px', fontWeight: '700', color: s.accent, textTransform: 'uppercase' }}>Инновациялық оқыту әдістері</span>
            </div>
            <h1 style={{ fontSize: '44px', fontWeight: '900', color: s.text, lineHeight: '1.25', margin: '0 0 20px 0', letterSpacing: '-1px' }}>
              Болашақ тарих мұғалімдерінің <br />
              <span style={{ color: currentTheme === 'nomad' ? '#0d9488' : s.accent }}>кәсіби құзыреттілігін дамыту</span> моделі
            </h1>
            <p style={{ fontSize: '18px', color: s.subText, lineHeight: '1.6', margin: '0 0 30px 0' }}>
              Инновациялық технологияларды қолдану арқылы тарих педагогтерінің теориялық негіздерін, әдістемелік шарттарын және тәжірибелік дағдыларын қалыптастыруға арналған цифрлық кеңістік.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: s.text, fontSize: '15px', fontWeight: '500' }}>
                <CheckCircle size={18} color="#10b981" /> Болашақ тарих мұғалімдері
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: s.text, fontSize: '15px', fontWeight: '500' }}>
                <CheckCircle size={18} color="#10b981" /> Іс-тәжірибедегі тарих педагогтері
              </div>
            </div>
            <button
              onClick={() => setView('auth')}
              style={{ backgroundColor: s.accent, color: '#fff', padding: '18px 40px', borderRadius: '16px', border: 'none', fontSize: '18px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              Платформаға кіру <ArrowRight size={20} />
            </button>
          </div>
          <div style={{ flex: '1 1 500px', display: 'flex', justifyContent: 'center' }}>
            <img
              src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop"
              alt="Кәсіби даму"
              style={{ width: '100%', maxWidth: '550px', height: 'auto', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', objectFit: 'cover' }}
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', maxWidth: '1200px', width: '100%' }}>
          <div style={{ backgroundColor: s.cardBg, padding: '30px', borderRadius: '20px', border: s.border }}>
            <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#eff6ff', width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}><Cpu size={24} color={s.accent} /></div>
            <h3 style={{ fontSize: '19px', fontWeight: '700', color: s.text, margin: '0 0 10px 0' }}>Инновациялық технологиялар</h3>
            <p style={{ fontSize: '14px', color: s.subText, lineHeight: '1.5', margin: 0 }}>Тарихты оқытудағы инновациялық әдістердің тиімділігін арттыратын заманауи цифрлық құралдарды қолдану.</p>
          </div>
          <div style={{ backgroundColor: s.cardBg, padding: '30px', borderRadius: '20px', border: s.border }}>
            <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#ecfdf5', width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}><Target size={24} color="#10b981" /></div>
            <h3 style={{ fontSize: '19px', fontWeight: '700', color: s.text, margin: '0 0 10px 0' }}>Теориялық талдау</h3>
            <p style={{ fontSize: '14px', color: s.subText, lineHeight: '1.5', margin: 0 }}>Болашақ тарих мұғалімдерінің кәсіби құзыреттілігін заманауи талаптарға сай бағалау.</p>
          </div>
          <div style={{ backgroundColor: s.cardBg, padding: '30px', borderRadius: '20px', border: s.border }}>
            <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#fef3c7', width: '45px', height: '45px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}><Award size={24} color="#f59e0b" /></div>
            <h3 style={{ fontSize: '19px', fontWeight: '700', color: s.text, margin: '0 0 10px 0' }}>Тәжірибелік сынақ</h3>
            <p style={{ fontSize: '14px', color: s.subText, lineHeight: '1.5', margin: 0 }}>Модельдің тиімділігін педагогикалық симуляторлар арқылы сынақтан өткізу.</p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'auth') {
    return (
      <div style={{ fontFamily: '"Inter", sans-serif', backgroundColor: s.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ backgroundColor: s.cardBg, padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '500px', border: s.border, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: currentTheme === 'nomad' ? '#f59e0b' : s.accent }}>UstazLab</h1>
            <p style={{ margin: '10px 0 0 0', color: s.subText, fontSize: '15px' }}>
              {isRegister ? 'Жаңа аккаунт жасау' : 'Жеке кабинетке кіру'}
            </p>
          </div>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {isRegister && (
              <>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: s.subText, marginBottom: '10px' }}>СІЗДІҢ СТАТУСЫҢЫЗ:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div onClick={() => setRole('student')} style={{ border: role === 'student' ? `2px solid ${s.accent}` : s.border, backgroundColor: role === 'student' ? (currentTheme === 'dark' ? '#0f172a' : '#eff6ff') : s.cardBg, padding: '15px', borderRadius: '16px', cursor: 'pointer', textAlign: 'center' }}>
                      <GraduationCap size={28} color={role === 'student' ? s.accent : s.subText} style={{ margin: '0 auto 8px auto' }} />
                      <div style={{ fontSize: '14px', fontWeight: '600', color: role === 'student' ? s.accent : s.text }}>Магистрант</div>
                    </div>
                    <div onClick={() => setRole('teacher')} style={{ border: role === 'teacher' ? `2px solid ${s.accent}` : s.border, backgroundColor: role === 'teacher' ? (currentTheme === 'dark' ? '#0f172a' : '#eff6ff') : s.cardBg, padding: '15px', borderRadius: '16px', cursor: 'pointer', textAlign: 'center' }}>
                      <BookOpen size={28} color={role === 'teacher' ? s.accent : s.subText} style={{ margin: '0 auto 8px auto' }} />
                      <div style={{ fontSize: '14px', fontWeight: '600', color: role === 'teacher' ? s.accent : s.text }}>Мұғалім</div>
                    </div>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: s.subText, marginBottom: '8px' }}>Аты-жөніңіз:</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} color={s.subText} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input type="text" placeholder="Мысалы: Асан Үсенов" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '14px 15px 14px 45px', borderRadius: '12px', border: s.border, backgroundColor: s.inputBg, color: s.text, fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
              </>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: s.subText, marginBottom: '8px' }}>Электрондық пошта:</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} color={s.subText} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="email" placeholder="example@mail.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '14px 15px 14px 45px', borderRadius: '12px', border: s.border, backgroundColor: s.inputBg, color: s.text, fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: s.subText, marginBottom: '8px' }}>Құпиясөз:</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color={s.subText} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '14px 15px 14px 45px', borderRadius: '12px', border: s.border, backgroundColor: s.inputBg, color: s.text, fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <button type="submit" style={{ marginTop: '10px', backgroundColor: s.accent, color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              {isRegister ? 'Тіркелу' : 'Кіру'} <ArrowRight size={18} />
            </button>
          </form>
          <div style={{ display: 'flex', alignItems: 'center', margin: '25px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: s.border }}></div>
            <span style={{ padding: '0 15px', color: s.subText, fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Немесе</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: s.border }}></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button type="button" onClick={() => handleSocialLogin('Google')} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: s.border, backgroundColor: s.cardBg, color: s.text, fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google арқылы жалғастыру
            </button>
            <button type="button" onClick={() => handleSocialLogin('Apple')} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: currentTheme === 'dark' ? '#ffffff' : '#000000', color: currentTheme === 'dark' ? '#000000' : '#ffffff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}>
              <svg width="20" height="20" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
              Apple арқылы жалғастыру
            </button>
            <button type="button" onClick={() => handleSocialLogin('Facebook')} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', backgroundColor: '#1877F2', color: '#ffffff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}>
              <svg width="20" height="20" viewBox="0 0 320 512" fill="currentColor"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" /></svg>
              Facebook арқылы жалғастыру
            </button>
          </div>
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: s.subText }}>
            {isRegister ? 'Аккаунтыңыз бар ма? ' : 'Аккаунтыңыз жоқ па? '}
            <span onClick={() => setIsRegister(!isRegister)} style={{ color: s.accent, fontWeight: '600', cursor: 'pointer' }}>
              {isRegister ? 'Кіру' : 'Тіркелу'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: '"Inter", sans-serif', backgroundColor: s.bg, minHeight: '100vh', padding: '30px', transition: 'all 0.3s ease' }}>
      <SidebarMenu />
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '25px', backgroundColor: currentTheme === 'dark' ? '#1e293b' : '#e2e8f0', padding: '10px', borderRadius: '12px', width: 'fit-content', margin: '0 auto 30px auto' }}>
        <button onClick={() => setCurrentTheme('light')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: currentTheme === 'light' ? '#2563eb' : 'transparent', color: currentTheme === 'light' ? '#fff' : s.text }}><Sun size={16} /> Apple Light</button>
        <button onClick={() => setCurrentTheme('dark')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: currentTheme === 'dark' ? '#38bdf8' : 'transparent', color: currentTheme === 'dark' ? '#000' : '#475569' }}><Moon size={16} /> Premium Dark</button>
        <button onClick={() => setCurrentTheme('nomad')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: currentTheme === 'nomad' ? '#0d9488' : 'transparent', color: currentTheme === 'nomad' ? '#fff' : s.text }}><Compass size={16} /> Neo-Nomad</button>
      </div>

      <header style={{ backgroundColor: currentTheme === 'nomad' ? '#112d24' : s.headerBg, color: currentTheme === 'light' ? '#0f172a' : 'white', padding: '20px 30px', borderRadius: '16px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: s.border }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => setIsMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.text, padding: '8px', borderRadius: '8px', backgroundColor: s.inputBg }}>
            <Menu size={24} />
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: currentTheme === 'nomad' ? '#f59e0b' : s.accent }}>UstazLab</h1>
            <p style={{ margin: '4px 0 0 0', color: s.subText, fontSize: '14px' }}>Қош келдіңіз, <span style={{ fontWeight: 'bold' }}>{name || 'Пайдаланушы'}</span>!</p>
          </div>
        </div>
      </header>

      {view === 'dashboard' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
            <div style={{ backgroundColor: s.cardBg, padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: `5px solid ${s.accent}`, borderTop: s.border, borderRight: s.border, borderBottom: s.border }}>
              <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#f1f5f9', padding: '12px', borderRadius: '12px' }}><Zap size={28} color={s.accent} /></div>
              <div><h3 style={{ margin: 0, fontSize: '14px', color: s.subText, fontWeight: '500' }}>Тиімділік өсімі</h3><p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '700', color: s.text }}>+{averageGrowth}%</p></div>
            </div>
            <div style={{ backgroundColor: s.cardBg, padding: '24px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '20px', borderLeft: `5px solid ${s.success}`, borderTop: s.border, borderRight: s.border, borderBottom: s.border }}>
              <div style={{ backgroundColor: '#ecfdf5', padding: '12px', borderRadius: '12px' }}><Award size={28} color={s.success} /></div>
              <div><h3 style={{ margin: 0, fontSize: '14px', color: s.subText, fontWeight: '500' }}>Кәсіби Статус</h3><p style={{ margin: '4px 0 0 0', fontSize: '24px', fontWeight: '700', color: s.text }}>{testCompleted ? 'Инноватор' : 'Бастапқы'}</p></div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '25px' }}>
            <div style={{ backgroundColor: s.cardBg, padding: '25px', borderRadius: '16px', border: s.border }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: s.text, margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}><BarChart3 color={s.accent} size={22} /> Құзыреттіліктердің 360° Радар Модели</h2>
                {!testCompleted && (
                  <button onClick={() => navigateTo('modules')} style={{ backgroundColor: s.success, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LayoutGrid size={18} /> Модульдерді көру
                  </button>
                )}
              </div>
              <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                  <RadarChart cx="50%" cy="50%" outerRadius="60%" data={competencies}>
                    <PolarGrid stroke={s.gridColor} />
                    <PolarAngleAxis dataKey="skill" stroke={s.axisColor} style={{ fontSize: '12px', fontWeight: '600' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} stroke={s.gridColor} tick={{ fill: s.axisColor, fontSize: '10px' }} />
                    <Radar name="Бастапқы деңгей" dataKey="baseline" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} />
                    <Radar name="Қазіргі нәтиже" dataKey="current" stroke={s.success} fill={s.success} fillOpacity={0.4} />
                    <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: s.text }} />
                    <RechartsTooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {view === 'methodology' && (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#f3e8ff', padding: '12px', borderRadius: '12px' }}>
              <FolderOpen size={32} color="#8b5cf6" />
            </div>
            <div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: s.text, margin: 0 }}>Методикалық қоржын</h2>
              <p style={{ margin: '5px 0 0 0', color: s.subText, fontSize: '15px' }}>Тарих мұғаліміне арналған эталондық ҚМЖ, КТЖ және БЖБ үлгілері.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
            {methodologyFiles.map(file => (
              <div key={file.id} style={{ backgroundColor: s.cardBg, padding: '25px', borderRadius: '16px', border: s.border, display: 'flex', flexDirection: 'column', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', backgroundColor: file.color }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : s.inputBg, padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: file.color, border: `1px solid ${file.color}40` }}>
                    {file.type}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: s.subText, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <FileText size={14} /> {file.format}
                  </div>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: s.text, margin: '0 0 10px 0', lineHeight: '1.4' }}>{file.title}</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <span style={{ fontSize: '12px', backgroundColor: s.inputBg, color: s.text, padding: '4px 8px', borderRadius: '6px', fontWeight: '500' }}>{file.grade}</span>
                  <span style={{ fontSize: '12px', backgroundColor: s.inputBg, color: s.text, padding: '4px 8px', borderRadius: '6px', fontWeight: '500' }}>{file.subject}</span>
                </div>
                <p style={{ fontSize: '14px', color: s.subText, margin: '0 0 20px 0', lineHeight: '1.5', flexGrow: 1 }}>{file.desc}</p>
                <button onClick={() => alert(`${file.title} файлы жүктелуде... (Бұл функция бэкенд қосылғанда іске қосылады)`)} style={{ width: '100%', backgroundColor: 'transparent', color: s.text, padding: '12px', borderRadius: '10px', border: s.border, fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = s.inputBg; e.currentTarget.style.borderColor = file.color; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = s.border; }}>
                  <Download size={18} color={file.color} /> Жүктеп алу
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'modules' && (
        <div style={{ maxWidth: '1000px', margin: '0 auto', marginBottom: '40px' }}>
          <div style={{ marginBottom: '35px', textAlign: 'center', backgroundColor: s.cardBg, padding: '30px', borderRadius: '16px', border: s.border }}>
            <h2 style={{ fontSize: '26px', fontWeight: '800', color: s.text, margin: '0 0 10px 0' }}>
              "Тарихты оқытудың заманауи технологиялары мен инновациялық құзыреттілік" курсы
            </h2>
            <p style={{ color: s.subText, fontSize: '15px', margin: 0 }}>
              Тарих пәні мұғалімдеріне арналған үздіксіз кәсіби даму практикумы
            </p>
          </div>
          <div style={{ display: 'grid', gap: '20px' }}>
            {courseModules.map((mod) => {
              const isLocked = mod.id > unlockedLevel;
              return (
                <div key={mod.id} style={{ backgroundColor: s.cardBg, padding: '25px', borderRadius: '16px', border: s.border, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isLocked ? 0.7 : 1, transition: 'all 0.3s' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: s.text, margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {isLocked ? <Lock size={20} color="#ef4444" /> : <BookOpen size={20} color="#10b981" />}
                      {mod.title}
                    </h3>
                    <p style={{ margin: 0, color: s.subText, fontSize: '14px' }}>{mod.desc}</p>
                  </div>
                  <button
                    onClick={() => !isLocked && startModule(mod.id)}
                    style={{ backgroundColor: isLocked ? s.inputBg : '#6366f1', color: isLocked ? s.subText : '#fff', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: '700', fontSize: '14px', cursor: isLocked ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                  >
                    {isLocked ? 'Бұғатталған' : 'Бастау'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'ailab' && (
        <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '50px' }}>
          <div style={{ marginBottom: '30px', backgroundColor: s.cardBg, padding: '30px', borderRadius: '16px', border: s.border, textAlign: 'center' }}>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: s.text, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '0 0 10px 0' }}>
              <Sparkles size={28} color="#8b5cf6" /> AI-Конструктор: Заманауи ҚМЖ
            </h2>
            <p style={{ color: s.subText, fontSize: '16px', margin: 0 }}>
              Қазақстандық білім беру стандартына (ЖБМ) сай тарих сабағын инновациялық әдістермен автоматты түрде жоспарлаңыз.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: s.cardBg, padding: '20px', borderRadius: '16px', border: s.border }}>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: s.text, marginBottom: '10px' }}>Сынып:</label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '15px', outline: 'none', backgroundColor: '#f8fafc', color: '#0f172a' }}>
                <option value="5">5-сынып</option>
                <option value="6">6-сынып</option>
                <option value="7">7-сынып</option>
                <option value="8">8-сынып</option>
                <option value="9">9-сынып</option>
                <option value="10">10-сынып</option>
                <option value="11">11-сынып</option>
              </select>
            </div>
            <div style={{ backgroundColor: s.cardBg, padding: '20px', borderRadius: '16px', border: s.border }}>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: s.text, marginBottom: '10px' }}>Пән:</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '15px', outline: 'none', backgroundColor: '#f8fafc', color: '#0f172a' }}>
                <option value="kz_history">Қазақстан тарихы</option>
                <option value="world_history">Дүниежүзі тарихы</option>
                <option value="law">Құқық негіздері</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: s.cardBg, padding: '20px', borderRadius: '16px', border: s.border }}>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: s.text, marginBottom: '10px' }}>Инновациялық әдіс-тәсіл:</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '15px', outline: 'none', backgroundColor: '#f8fafc', color: '#0f172a' }}>
                <option value="jigsaw">Jigsaw (Ара) әдісі - Топтық зерттеу</option>
                <option value="flipped">Төңкерілген сынып (Flipped Classroom)</option>
                <option value="case_study">Case Study (Жағдаяттық талдау)</option>
                <option value="gamification">Геймификация (Рөлдік ойын)</option>
                <option value="debate">Пікірталас / Дебат</option>
                <option value="factcheck">Фактчекинг және Деректану</option>
                <option value="other">Тізімде жоқ (Басқа әдіс)</option>
              </select>
            </div>
            <div style={{ backgroundColor: s.cardBg, padding: '20px', borderRadius: '16px', border: s.border, opacity: method === 'other' ? 1 : 0.5 }}>
              <label style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: s.text, marginBottom: '10px' }}>Өз әдісіңізді жазыңыз:</label>
              <input
                type="text"
                value={customMethod}
                onChange={(e) => setCustomMethod(e.target.value)}
                disabled={method !== 'other'}
                placeholder="Мысалы: Фишбоун, ПОПС формуласы..."
                style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '15px', outline: 'none', backgroundColor: '#fff', color: '#0f172a', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ backgroundColor: s.cardBg, padding: '20px', borderRadius: '16px', border: s.border, marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '15px', fontWeight: '700', color: s.text, marginBottom: '10px' }}>Нақты Оқу Мақсаты (ОМ) немесе Тақырып:</label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Мысалы: 7.3.1.1 - Қазақ хандығының құрылуын тарихи оқиғалармен байланыстыра отырып түсіндіру..."
              style={{ width: '100%', height: '100px', padding: '15px', borderRadius: '10px', border: '2px solid #e2e8f0', fontSize: '15px', fontFamily: 'inherit', resize: 'vertical', outline: 'none', color: '#0f172a', boxSizing: 'border-box' }}
            ></textarea>
          </div>

          <button
            onClick={generateLessonPlan}
            disabled={isLoading}
            style={{ width: '100%', backgroundColor: isLoading ? '#94a3b8' : s.accent, color: '#fff', padding: '18px', borderRadius: '16px', border: 'none', fontSize: '18px', fontWeight: '700', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }}
          >
            {isLoading ? <Bot size={24} /> : <Sparkles size={24} />}
            {isLoading ? 'Жасанды интеллект ҚМЖ құрастыруда (5-10 сек)...' : 'ҚМЖ Құрастыру'}
          </button>

          <div style={{ marginTop: '40px', backgroundColor: '#fff', borderRadius: '16px', border: '2px solid #8b5cf6', overflow: 'hidden', boxShadow: '0 10px 30px rgba(139, 92, 246, 0.15)' }}>
            <div style={{ backgroundColor: '#8b5cf6', padding: '15px 25px', color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={24} color="#fff" />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>AI-Генерация: Сіздің сабақ жоспарыңыз</h3>
            </div>
            <div style={{ padding: '25px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #8b5cf6', whiteSpace: 'pre-wrap', lineHeight: '1.7', fontSize: '15px', color: '#1e293b' }}>
                {aiResult || "Жүйе дайын. Сабақ жоспарын құру үшін тақырыпты жазып, жоғарыдағы батырманы басыңыз."}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === 'sources' && (
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#fef3c7', padding: '12px', borderRadius: '12px' }}>
              <Compass size={32} color="#f59e0b" />
            </div>
            <div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: s.text, margin: 0 }}>Интерактивті Деректану</h2>
              <p style={{ margin: '5px 0 0 0', color: s.subText, fontSize: '15px' }}>Тарихи жәдігерлерді сабақта зерттеу нысаны ретінде қолдану әдістемесі.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
            {historicalSources.map(source => (
              <div key={source.id} style={{ backgroundColor: s.cardBg, padding: '25px', borderRadius: '16px', border: s.border, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: source.color }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', paddingLeft: '10px' }}>
                  <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : s.inputBg, padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: source.color, border: `1px solid ${source.color}40` }}>
                    {source.category}
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: '700', color: '#fff', backgroundColor: source.color, padding: '4px 8px', borderRadius: '6px' }}>
                    {source.tag}
                  </div>
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: '800', color: s.text, margin: '0 0 10px 10px' }}>{source.name}</h3>
                <p style={{ fontSize: '14px', color: s.subText, margin: '0 0 20px 10px', lineHeight: '1.6', flexGrow: 1 }}>{source.desc}</p>
                <button
                  onClick={() => setActiveSourceModal(source)}
                  style={{ marginLeft: '10px', width: 'calc(100% - 10px)', backgroundColor: s.inputBg, color: s.text, padding: '12px', borderRadius: '10px', border: s.border, fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                >
                  <BookOpen size={18} color={source.color} /> Әдістемені көру
                </button>
              </div>
            ))}
          </div>
          {activeSourceModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
              <div style={{ backgroundColor: s.cardBg, padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '700px', border: s.border, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                <button onClick={() => setActiveSourceModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: s.subText }}><X size={24} /></button>
                <h3 style={{ fontSize: '24px', fontWeight: '800', color: s.text, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '30px' }}>
                  <Compass color={activeSourceModal.color} size={28} style={{ flexShrink: 0 }} /> {activeSourceModal.name}
                </h3>
                <div style={{ backgroundColor: s.inputBg, padding: '20px', borderRadius: '12px', marginBottom: '20px', borderLeft: `4px solid ${activeSourceModal.color}` }}>
                  <h4 style={{ color: activeSourceModal.color, fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '800' }}>Педагогикалық тәсіл:</h4>
                  <p style={{ color: s.text, fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{activeSourceModal.pedagogy}</p>
                </div>
                <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#f8fafc', padding: '20px', borderRadius: '12px', border: s.border }}>
                  <h4 style={{ color: s.text, fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Target size={18} color="#10b981" /> Тәжірибелік тапсырма (Оқушыларға):
                  </h4>
                  <p style={{ color: s.text, fontSize: '15px', lineHeight: '1.6', margin: 0, fontStyle: 'italic' }}>"{activeSourceModal.task}"</p>
                </div>
                <button onClick={() => setActiveSourceModal(null)} style={{ marginTop: '25px', width: '100%', backgroundColor: activeSourceModal.color, color: '#fff', padding: '14px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
                  Жабу
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'visuals' && (
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#fee2e2', padding: '12px', borderRadius: '12px' }}>
              <Sparkles size={32} color="#ef4444" />
            </div>
            <div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: s.text, margin: 0 }}>AI Визуализация (Тарихи Ремейк)</h2>
              <p style={{ margin: '5px 0 0 0', color: s.subText, fontSize: '15px' }}>Көне жазбалар мен деректерді жасанды интеллект арқылы қайта тірілту.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px', marginTop: '30px' }}>
            {historicalVisuals.map(visual => (
              <div key={visual.id} style={{ backgroundColor: s.cardBg, borderRadius: '16px', border: s.border, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '180px', width: '100%', backgroundImage: `url(${visual.imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                    {visual.category}
                  </div>
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: s.text, margin: '0 0 10px 0' }}>{visual.name}</h3>
                  <p style={{ fontSize: '14px', color: s.subText, margin: '0 0 20px 0', lineHeight: '1.5', flexGrow: 1 }}>{visual.desc}</p>
                  <button
                    onClick={() => setActiveVisualModal(visual)}
                    style={{ width: '100%', backgroundColor: s.inputBg, color: s.text, padding: '12px', borderRadius: '10px', border: `1px solid ${visual.color}50`, fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    «Сценарий» мен «Ремейкті» көру
                  </button>
                </div>
              </div>
            ))}
          </div>
          {activeVisualModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
              <div style={{ backgroundColor: s.cardBg, padding: '30px', borderRadius: '24px', width: '100%', maxWidth: '800px', border: s.border, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                <button onClick={() => setActiveVisualModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: s.subText }}><X size={24} /></button>
                <h3 style={{ fontSize: '24px', fontWeight: '800', color: s.text, marginBottom: '25px', paddingRight: '30px' }}>
                  {activeVisualModal.name}
                </h3>
                <div style={{ backgroundColor: s.inputBg, padding: '15px 20px', borderRadius: '12px', marginBottom: '25px', display: 'flex', alignItems: 'flex-start', gap: '12px', border: `1px solid ${activeVisualModal.color}40` }}>
                  <BookMarked size={20} color={activeVisualModal.color} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: s.subText, textTransform: 'uppercase', letterSpacing: '1px' }}>Тарихи Дереккөз:</span>
                    <p style={{ fontSize: '15px', color: s.text, margin: '4px 0 0 0', fontWeight: '600' }}>{activeVisualModal.source}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                  <div style={{ backgroundColor: s.inputBg, padding: '20px', borderRadius: '16px', borderLeft: `4px solid #64748b` }}>
                    <h4 style={{ color: '#64748b', fontSize: '13px', marginBottom: '10px', textTransform: 'uppercase', fontWeight: '800' }}>🎬 Ескі Сценарий (Тарихи дерек):</h4>
                    <p style={{ color: s.text, fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{activeVisualModal.script}</p>
                  </div>
                  <div style={{ backgroundColor: `${activeVisualModal.color}15`, padding: '20px', borderRadius: '16px', borderLeft: `4px solid ${activeVisualModal.color}` }}>
                    <h4 style={{ color: activeVisualModal.color, fontSize: '13px', marginBottom: '10px', textTransform: 'uppercase', fontWeight: '800' }}>🌟 Жаңа Ремейк (AI генерация):</h4>
                    <p style={{ color: s.text, fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{activeVisualModal.remake}</p>
                  </div>
                </div>
                <div style={{ width: '100%', height: '300px', borderRadius: '16px', backgroundImage: `url(${activeVisualModal.imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '20px' }}></div>
                <button onClick={() => setActiveVisualModal(null)} style={{ width: '100%', backgroundColor: activeVisualModal.color, color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}>
                  Жабу
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'test' && activeModuleId && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ backgroundColor: s.cardBg, padding: '30px', borderRadius: '20px', border: s.border, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ color: s.text, margin: 0, fontSize: '20px' }}>{courseModules.find(m => m.id === activeModuleId).title}</h2>
              <div style={{ backgroundColor: s.inputBg, padding: '8px 16px', borderRadius: '20px', color: s.subText, fontSize: '14px', fontWeight: '600' }}>
                Сұрақ {currentQuestionIdx + 1} / {courseModules.find(m => m.id === activeModuleId).questions.length}
              </div>
            </div>
            <h3 style={{ fontSize: '18px', color: s.text, lineHeight: '1.6', margin: '0 0 30px 0', fontWeight: '600' }}>
              {courseModules.find(m => m.id === activeModuleId).questions[currentQuestionIdx].scenario}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {courseModules.find(m => m.id === activeModuleId).questions[currentQuestionIdx].options.map((opt, i) => (
                <button key={i} onClick={() => !showCitation && handleAnswer(opt.points)} style={{ textAlign: 'left', padding: '18px', borderRadius: '12px', border: s.border, backgroundColor: showCitation ? s.inputBg : s.bg, color: s.text, fontSize: '15px', lineHeight: '1.5', cursor: showCitation ? 'default' : 'pointer', transition: 'all 0.2s', opacity: showCitation ? 0.7 : 1 }}>
                  {opt.text}
                </button>
              ))}
            </div>
            {showCitation && (
              <div style={{ marginTop: '30px', backgroundColor: '#ecfdf5', border: '1px solid #10b981', padding: '20px', borderRadius: '12px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <Info size={24} color="#10b981" style={{ flexShrink: 0 }} />
                <div>
                  <h4 style={{ margin: '0 0 8px 0', color: '#065f46', fontSize: '15px' }}>Ғылыми негіздеме</h4>
                  <p style={{ margin: 0, color: '#064e3b', fontSize: '14px', lineHeight: '1.5' }}>{courseModules.find(m => m.id === activeModuleId).questions[currentQuestionIdx].citation}</p>
                  <button onClick={nextQuestion} style={{ marginTop: '20px', backgroundColor: '#10b981', color: '#fff', padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' }}>
                    {currentQuestionIdx < courseModules.find(m => m.id === activeModuleId).questions.length - 1 ? 'Келесі жағдаят' : 'Академиялық Рефлексияға өту'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'reflection' && activeModuleId && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ backgroundColor: s.cardBg, padding: '40px', borderRadius: '24px', border: s.border, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#eff6ff', padding: '12px', borderRadius: '12px' }}>
                <Edit3 size={28} color={s.accent} />
              </div>
              <h2 style={{ color: s.text, margin: 0, fontSize: '24px', fontWeight: '800' }}>Академиялық Рефлексия</h2>
            </div>
            <p style={{ fontSize: '16px', color: s.text, lineHeight: '1.6', marginBottom: '25px', fontWeight: '500' }}>
              {courseModules.find(m => m.id === activeModuleId).reflectionQuestion}
            </p>
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Өз ойыңызды осы жерге жазыңыз..."
              style={{ width: '100%', height: '150px', padding: '20px', borderRadius: '12px', border: s.border, backgroundColor: s.inputBg, color: s.text, fontSize: '15px', outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit', marginBottom: '20px' }}
            />
            <button onClick={handleReflectionSubmit} style={{ width: '100%', backgroundColor: s.accent, color: '#fff', padding: '16px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              Жіберу және Жалғастыру <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {view === 'methods' && (
        <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#f3e8ff', padding: '12px', borderRadius: '12px' }}>
              <Target size={32} color="#8b5cf6" />
            </div>
            <div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: s.text, margin: 0 }}>Инновациялық әдістер зертханасы</h2>
              <p style={{ margin: '5px 0 0 0', color: s.subText, fontSize: '15px' }}>Мұғалімнің кәсіби шеберлігін арттыратын заманауи педагогикалық тәсілдер.</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '30px' }}>
            {innovativeMethods.map(method2 => (
              <div key={method2.id} style={{ backgroundColor: s.cardBg, padding: '25px', borderRadius: '16px', border: s.border, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: method2.color }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px', paddingLeft: '10px' }}>
                  <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : s.inputBg, padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', color: method2.color, border: `1px solid ${method2.color}40` }}>
                    {method2.category}
                  </div>
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: '800', color: s.text, margin: '0 0 10px 10px' }}>{method2.name}</h3>
                <p style={{ fontSize: '14px', color: s.subText, margin: '0 0 20px 10px', lineHeight: '1.6', flexGrow: 1 }}>{method2.desc}</p>
                <button
                  onClick={() => setActiveMethodModal(method2)}
                  style={{ marginLeft: '10px', width: 'calc(100% - 10px)', backgroundColor: s.inputBg, color: s.text, padding: '12px', borderRadius: '10px', border: s.border, fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
                >
                  <Cpu size={18} color={method2.color} /> Әдістемені ашу
                </button>
              </div>
            ))}
          </div>
          {activeMethodModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px' }}>
              <div style={{ backgroundColor: s.cardBg, padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '700px', border: s.border, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
                <button onClick={() => setActiveMethodModal(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: s.subText }}><X size={24} /></button>
                <h3 style={{ fontSize: '24px', fontWeight: '800', color: s.text, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', paddingRight: '30px' }}>
                  <Target color={activeMethodModal.color} size={28} style={{ flexShrink: 0 }} /> {activeMethodModal.name}
                </h3>
                <div style={{ backgroundColor: s.inputBg, padding: '20px', borderRadius: '12px', marginBottom: '20px', borderLeft: `4px solid ${activeMethodModal.color}` }}>
                  <h4 style={{ color: activeMethodModal.color, fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase', fontWeight: '800' }}>Нақты тарихи факт:</h4>
                  <p style={{ color: s.text, fontSize: '15px', lineHeight: '1.6', margin: 0, fontWeight: '500' }}>{activeMethodModal.fact}</p>
                </div>
                <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#f8fafc', padding: '20px', borderRadius: '12px', border: s.border }}>
                  <h4 style={{ color: s.text, fontSize: '14px', marginBottom: '10px', textTransform: 'uppercase', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Users size={18} color={activeMethodModal.color} /> Сабақта қолдану алгоритмі:
                  </h4>
                  <p style={{ color: s.text, fontSize: '15px', lineHeight: '1.6', margin: 0 }}>{activeMethodModal.application}</p>
                </div>
                <button onClick={() => setActiveMethodModal(null)} style={{ marginTop: '25px', width: '100%', backgroundColor: activeMethodModal.color, color: '#fff', padding: '14px', borderRadius: '10px', border: 'none', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}>
                  Жабу
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'gamification' && (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#eff6ff', padding: '12px', borderRadius: '12px' }}>
              <PlayCircle size={32} color="#3b82f6" />
            </div>
            <div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: s.text, margin: 0 }}>Геймификация және Квест</h2>
              <p style={{ margin: '5px 0 0 0', color: s.subText, fontSize: '15px' }}>Сабақ үстінде тікелей қолдануға дайын рөлдік квесттер мен көшбасшылар тақтасы.</p>
            </div>
          </div>

          <div style={{ backgroundColor: s.cardBg, padding: '25px', borderRadius: '16px', border: s.border, marginBottom: '25px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: s.text, margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={20} color="#f59e0b" /> Көшбасшылар тақтасы (сабақ барысында тірі жаңартылады)
            </h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Жаңа топ/оқушы атын жазыңыз..."
                style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: s.border, backgroundColor: s.inputBg, color: s.text, fontSize: '14px', outline: 'none' }}
              />
              <button
                onClick={() => {
                  if (!newTeamName.trim()) return;
                  setLeaderboard(prev => [...prev, { id: Date.now(), name: newTeamName.trim(), points: 0 }]);
                  setNewTeamName('');
                }}
                style={{ backgroundColor: s.accent, color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}
              >
                Қосу
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[...leaderboard].sort((a, b) => b.points - a.points).map((team, idx) => (
                <div key={team.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', backgroundColor: s.inputBg }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', color: idx === 0 ? '#f59e0b' : s.subText, minWidth: '24px' }}>{idx + 1}</span>
                  <span style={{ flex: 1, fontSize: '15px', fontWeight: '600', color: s.text }}>{team.name}</span>
                  <span style={{ fontSize: '18px', fontWeight: '800', color: s.accent, minWidth: '40px', textAlign: 'right' }}>{team.points}</span>
                  <button onClick={() => setLeaderboard(prev => prev.map(t => t.id === team.id ? { ...t, points: t.points + 1 } : t))} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>+1</button>
                  <button onClick={() => setLeaderboard(prev => prev.map(t => t.id === team.id ? { ...t, points: Math.max(0, t.points - 1) } : t))} style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', width: '30px', height: '30px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>-1</button>
                </div>
              ))}
            </div>
          </div>

          <h3 style={{ fontSize: '17px', fontWeight: '700', color: s.text, margin: '0 0 15px 0' }}>Дайын квест-сценарийлер</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {questScenarios.map(q => {
              const isOpen = activeQuestId === q.id;
              return (
                <div key={q.id} style={{ backgroundColor: s.cardBg, borderRadius: '16px', border: s.border, overflow: 'hidden' }}>
                  <button
                    onClick={() => setActiveQuestId(isOpen ? null : q.id)}
                    style={{ width: '100%', textAlign: 'left', padding: '20px 25px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: q.color, backgroundColor: `${q.color}20`, padding: '3px 10px', borderRadius: '6px' }}>{q.grade}</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: s.subText, backgroundColor: s.inputBg, padding: '3px 10px', borderRadius: '6px' }}>{q.subject}</span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: s.text }}>{q.title}</h4>
                      <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: s.subText }}>{q.desc}</p>
                    </div>
                    <ArrowRight size={20} color={s.subText} style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 25px 25px 25px', borderTop: s.border }}>
                      <h5 style={{ fontSize: '13px', fontWeight: '800', color: q.color, textTransform: 'uppercase', margin: '20px 0 12px 0' }}>Рөлдік карталар</h5>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                        {q.roles.map((r, i) => (
                          <div key={i} style={{ backgroundColor: s.inputBg, padding: '15px', borderRadius: '12px', borderLeft: `3px solid ${q.color}` }}>
                            <p style={{ margin: '0 0 6px 0', fontWeight: '700', fontSize: '14px', color: s.text }}>{r.name}</p>
                            <p style={{ margin: 0, fontSize: '13px', color: s.subText, lineHeight: '1.5' }}>{r.desc}</p>
                          </div>
                        ))}
                      </div>
                      <h5 style={{ fontSize: '13px', fontWeight: '800', color: q.color, textTransform: 'uppercase', margin: '0 0 12px 0' }}>Квест-хаттар (кезең-кезеңімен)</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {q.quest.map((step, i) => (
                          <div key={i} style={{ display: 'flex', gap: '12px', backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#f8fafc', padding: '14px', borderRadius: '10px' }}>
                            <span style={{ fontWeight: '800', color: q.color, fontSize: '14px', flexShrink: 0 }}>{i + 1}</span>
                            <div>
                              <p style={{ margin: '0 0 4px 0', fontWeight: '700', fontSize: '13px', color: s.text }}>{step.title}</p>
                              <p style={{ margin: 0, fontSize: '13px', color: s.subText, lineHeight: '1.5' }}>{step.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'casestudy' && (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#fee2e2', padding: '12px', borderRadius: '12px' }}>
              <Users size={32} color="#ef4444" />
            </div>
            <div>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: s.text, margin: 0 }}>Тарихи Case-Study базасы</h2>
              <p style={{ margin: '5px 0 0 0', color: s.subText, fontSize: '15px' }}>Оқушыны тарихи тұлғаның орнына қойып, сыни ойлауды дамытатын дилеммалар.</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {historicalDilemmas.map(d => {
              const isOpen = activeDilemmaId === d.id;
              const selected = selectedOptionByDilemma[d.id];
              return (
                <div key={d.id} style={{ backgroundColor: s.cardBg, borderRadius: '16px', border: s.border, overflow: 'hidden' }}>
                  <button
                    onClick={() => setActiveDilemmaId(isOpen ? null : d.id)}
                    style={{ width: '100%', textAlign: 'left', padding: '20px 25px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: d.color, backgroundColor: `${d.color}20`, padding: '3px 10px', borderRadius: '6px' }}>{d.grade}</span>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: s.subText, backgroundColor: s.inputBg, padding: '3px 10px', borderRadius: '6px' }}>{d.subject}</span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: s.text }}>{d.title}</h4>
                    </div>
                    <ArrowRight size={20} color={s.subText} style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 25px 25px 25px' }}>
                      <div style={{ backgroundColor: s.inputBg, padding: '16px', borderRadius: '12px', marginBottom: '15px', borderLeft: `3px solid ${d.color}` }}>
                        <h5 style={{ fontSize: '12px', fontWeight: '800', color: d.color, textTransform: 'uppercase', margin: '0 0 6px 0' }}>1. Ситуация</h5>
                        <p style={{ margin: 0, fontSize: '14px', color: s.text, lineHeight: '1.6' }}>{d.situation}</p>
                      </div>
                      <div style={{ backgroundColor: s.inputBg, padding: '16px', borderRadius: '12px', marginBottom: '15px', borderLeft: `3px solid ${d.color}` }}>
                        <h5 style={{ fontSize: '12px', fontWeight: '800', color: d.color, textTransform: 'uppercase', margin: '0 0 6px 0' }}>2. Проблема</h5>
                        <p style={{ margin: 0, fontSize: '14px', color: s.text, lineHeight: '1.6' }}>{d.problem}</p>
                      </div>
                      <h5 style={{ fontSize: '12px', fontWeight: '800', color: d.color, textTransform: 'uppercase', margin: '0 0 10px 0' }}>3. Таңдау нұсқалары (оқушылар дауыс береді)</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '15px' }}>
                        {d.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedOptionByDilemma(prev => ({ ...prev, [d.id]: i }))}
                            style={{ textAlign: 'left', padding: '12px 16px', borderRadius: '10px', border: selected === i ? `2px solid ${d.color}` : s.border, backgroundColor: selected === i ? `${d.color}15` : (currentTheme === 'dark' ? '#0f172a' : '#f8fafc'), color: s.text, fontSize: '14px', cursor: 'pointer' }}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#f8fafc', padding: '16px', borderRadius: '12px', border: s.border }}>
                        <h5 style={{ fontSize: '12px', fontWeight: '800', color: s.text, textTransform: 'uppercase', margin: '0 0 10px 0' }}>4. Мұғалімге арналған бағыттаушы сұрақтар</h5>
                        <ul style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {d.guidingQuestions.map((q, i) => (
                            <li key={i} style={{ fontSize: '13px', color: s.subText, lineHeight: '1.5' }}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === 'literature' && (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '800', color: s.text, marginBottom: '10px' }}>Пайдаланылған ғылыми әдебиеттер</h2>
          <p style={{ color: s.subText, marginBottom: '30px', fontSize: '16px' }}>Платформаның әдіснамалық негізін құрайтын және симулятордағы жағдаяттарды шешуге арналған 20 негізгі дереккөз тізімі.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {literatureList.map(lit => (
              <div key={lit.id} style={{ backgroundColor: s.cardBg, padding: '24px', borderRadius: '16px', border: s.border, display: 'flex', flexDirection: 'column', transition: 'all 0.2s', cursor: 'default' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                  <div style={{ backgroundColor: currentTheme === 'dark' ? '#0f172a' : '#fffbeb', width: '45px', height: '45px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookMarked size={22} color="#f59e0b" />
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: s.text, margin: 0, lineHeight: '1.4' }}>{lit.author}</h3>
                </div>
                <p style={{ fontSize: '14px', color: s.text, fontStyle: 'italic', margin: '0 0 15px 0', lineHeight: '1.5', flexGrow: 1 }}>"{lit.title}"</p>
                <div style={{ borderTop: s.border, paddingTop: '15px' }}>
                  <p style={{ fontSize: '13px', color: s.subText, margin: 0, lineHeight: '1.5' }}><strong>Маңызы:</strong> {lit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}