/** Static bilingual Musaned contract copy (always prints EN + AR together). */

export type BilingualText = {
  en: string;
  ar: string;
};

export const CONTRACT_TITLE: BilingualText = {
  en: "STANDARD EMPLOYMENT CONTRACT FOR THE FILIPINO DOMESTIC WORKER BOUND FOR THE KINGDOM OF SAUDI ARABIA",
  ar: "عقد عمل موحد للعاملة المنزلية الفلبينية المتجهة إلى المملكة العربية السعودية",
};

export const CONTRACT_PREAMBLE: BilingualText = {
  en: "This employment contract is executed unto by and between:",
  ar: "يتم تنفيذ عقد العمل هذا بين:",
};

export const LABELS = {
  employerName: { en: "Name of Employer", ar: "اسم صاحب العمل" },
  nationalId: { en: "National ID No", ar: "رقم الهوية الوطنية" },
  address: { en: "Address", ar: "العنوان" },
  civilStatus: { en: "Civil Status", ar: "الأحوال المدنية" },
  contactNumber: { en: "Contact Number", ar: "رقم الاتصال" },
  representedBy: { en: "Represented by", ar: "ويمثلها" },
  saudiAgencyName: {
    en: "Name of Saudi Recruitment Agency",
    ar: "اسم الوكالة السعودية للتوظيف",
  },
  licenseNo: { en: "License No", ar: "رقم الترخيص" },
  officialRep: {
    en: "Name of Official Representative",
    ar: "اسم الممثل الرسمي للوكالة",
  },
  passportNumber: { en: "Passport Number", ar: "رقم جواز السفر" },
  dateAndPlaceOfIssue: {
    en: "Date and Place of Issue",
    ar: "تاريخ ومكان الإصدار",
  },
  workerName: {
    en: "Name of Domestic Worker",
    ar: "اسم العاملة المنزلية",
  },
  addressInPh: {
    en: "Address in the Philippines",
    ar: "العنوان في الفلبين",
  },
  contactNumbers: { en: "Contact Numbers", ar: "أرقام الاتصال" },
  phAgencyName: {
    en: "Name of Philippine Recruitment Agency",
    ar: "اسم وكالة التوظيف الفلبينية",
  },
  siteOfEmployment: { en: "Site of Employment", ar: "موقع التوظيف" },
  monthlySalary: { en: "Monthly Salary", ar: "الراتب الشهري" },
  sar: { en: "SAR", ar: "ريال سعودي" },
  signedBy: { en: "Signed by", ar: "وقع من كل" },
  signatureOverName: {
    en: "(Signature over printed name)",
    ar: "(التوقيع فوق الاسم المطبوع)",
  },
  dateSigned: { en: "Date signed", ar: "تاريخ التوقيع" },
  domesticWorker: { en: "Domestic Worker", ar: "العاملة المنزلية" },
  employer: { en: "Employer", ar: "المستخدم" },
  phAgency: {
    en: "Philippine Recruitment Agency",
    ar: "وكالة التوظيف الفلبينية",
  },
  saAgency: {
    en: "Saudi Recruitment Agency",
    ar: "الوكالة السعودية للتوظيف",
  },
  annexTitle: {
    en: 'ANNEX "A" — Duties and Responsibilities of the Domestic Worker',
    ar: 'الملحق "أ" — واجبات ومسؤوليات العاملة المنزلية',
  },
  voluntarily: {
    en: "Voluntarily binding themselves to the following terms and conditions:",
    ar: "يلتزمون طواعية بالشروط والأحكام التالية:",
  },
} as const;

export type ContractClause = {
  number: string;
  title: BilingualText;
  body: BilingualText;
  /** Optional lettered sub-items */
  items?: BilingualText[];
};

export const CONTRACT_CLAUSES: ContractClause[] = [
  {
    number: "2",
    title: { en: "Contract Duration", ar: "مدة العقد" },
    body: {
      en: "The duration of contract shall be for two (2) years effective from the date of departure of the worker from the Philippines.",
      ar: "تكون مدة العقد سنتين (2) سارية المفعول من تاريخ مغادرة العامل للفلبين.",
    },
  },
  {
    number: "3",
    title: {
      en: "Duties and Responsibilities",
      ar: "الواجبات والمسؤوليات",
    },
    body: {
      en: 'The domestic worker shall perform the duties and responsibilities as shown in Annex "A" of this Contract. The employer shall have the duty of providing a safe living and work environment for the domestic worker, that is free from physical and psychological hazards. In particular, the domestic worker:',
      ar: 'على العاملة المنزلية أن تؤدي الواجبات والمسؤوليات المبينة في الملحق "أ" من هذا العقد. على صاحب العمل واجب توفير بيئة معيشية وعمل آمنة للعامل/ة المنزلية، خالية من المخاطر الجسدية والنفسية. وعلى وجه الخصوص فإن العاملة المنزلية:',
    },
    items: [
      {
        en: "Shall not be assigned to carry out any dangerous work that threatens his/her health, the integrity of his/her body, or impair his/her human dignity;",
        ar: "لا يجوز تكليفه/ها بأي عمل خطير يهدد صحته/ها أو سلامة جسده/ها أو ينال من كرامته/ها الإنسانية؛",
      },
      {
        en: "Shall not be allowed to perform domestic work for other parties;",
        ar: "لا يُسمح له/ها بأداء الأعمال المنزلية لأطراف أخرى؛",
      },
      {
        en: "Shall not be subjected to any form of discrimination and harassment due to, among other things, gender, age, race and religious beliefs; and",
        ar: "لا يجوز أن يتعرض لأي شكل من أشكال التمييز والمضايقة بسبب الجنس والعمر والعرق والمعتقدات الدينية وغيرها؛",
      },
      {
        en: "Shall be provided with necessary and adequate assistance for the protection of his/her physical and psychological health, including access to timely medical and wellness service that takes into account, among other things, his/her gender-specific needs.",
        ar: "يُقدم له/ها المساعدة اللازمة والكافية لحماية صحته/ها البدنية والنفسية، بما في ذلك الحصول على الخدمات الطبية والصحية في الوقت المناسب التي تراعي احتياجاته/ها الخاصة بنوع الجنس.",
      },
    ],
  },
  {
    number: "3b",
    title: { en: "", ar: "" },
    body: {
      en: "Both the employer and domestic worker shall perform their reciprocal obligations with mutual respect for each other, including the domestic worker's duty to respect for the teachings of the Islamic religion, the regulations in force in the Kingdom, and the culture of the Saudi society.",
      ar: "على كل من صاحب العمل والعاملة المنزلية أداء التزاماتهما المتبادلة مع الاحترام المتبادل لبعضهما البعض، بما في ذلك واجب العاملة المنزلية في احترام تعاليم الدين الإسلامي، والأنظمة المعمول بها في المملكة، وثقافة المجتمع السعودي.",
    },
  },
  {
    number: "4",
    title: { en: "Monthly Salary", ar: "الراتب الشهري" },
    body: {
      en: "The domestic worker and the employer agree on a monthly salary of SAR {salary}, which is in accordance with the laws and regulations prevailing in both countries. The monthly salary shall start upon actual reporting to work, and shall be due at the end of each calendar month.",
      ar: "يتفق العاملة المنزلية وصاحب العمل على راتب شهري قدره {salary} ريال سعودي، وفقاً للقوانين والأنظمة السارية في كلا البلدين. يبدأ الراتب الشهري عند الإبلاغ الفعلي عن العمل، ويكون مستحقاً في نهاية كل شهر ميلادي.",
    },
  },
  {
    number: "5",
    title: {
      en: "Manner of Payment of Monthly Salary",
      ar: "طريقة صرف الراتب الشهري",
    },
    body: {
      en: "The employer shall pay the monthly salary of the domestic worker by remitting or depositing to his/her bank or e-wallet account. The deposit slip or the proof of payment shall be given to the domestic worker. Upon request by the domestic worker, the employer shall help the domestic worker to remit his/her salary to his/her beneficiary in the Philippines through proper banking channels or e-wallet.",
      ar: "يدفع صاحب العمل الراتب الشهري للعاملة المنزلية عن طريق التحويل أو الإيداع في حسابه/ها البنكي أو المحفظة الإلكترونية. تُعطى قسيمة الإيداع أو إثبات الدفع للعاملة المنزلية. بناءً على طلب العاملة المنزلية، يساعد صاحب العمل على تحويل راتبه/ها إلى المستفيد في الفلبين عبر القنوات المصرفية المناسبة أو المحفظة الإلكترونية.",
    },
  },
  {
    number: "6",
    title: { en: "Contract Insurance", ar: "تأمين العقد" },
    body: {
      en: "It shall be mandatory for the employer to acquire and maintain a contract insurance in the Kingdom of Saudi Arabia beneficial for both parties, i.e., for the benefit of the domestic worker in case of unpaid salaries and delay in payment of salaries, among others, on the part of the employer; and for the benefit of the employer in the event of the abscondment or pre-termination of the contract by the domestic worker, among others. The premium shall be timely paid by the employer.",
      ar: "يلزم صاحب العمل بالحصول على تأمين عقد في المملكة العربية السعودية والحفاظ عليه يعود بالنفع على الطرفين، لصالح العاملة المنزلية في حالة عدم دفع الرواتب أو التأخر في دفعها وغيرها من جانب صاحب العمل؛ ولصالح صاحب العمل في حالة هروب العاملة المنزلية أو إنهاء العقد قبل أوانه وغيرها. يدفع صاحب العمل القسط في الوقت المناسب.",
    },
  },
  {
    number: "7",
    title: {
      en: "Required Daily Rest Hours",
      ar: "ساعات الراحة اليومية المطلوبة",
    },
    body: {
      en: "The domestic worker shall be provided with continuous rest of at least nine (9) hours per day.",
      ar: "يجب تزويد العاملة المنزلية براحة مستمرة لا تقل عن تسع (9) ساعات يومياً.",
    },
  },
  {
    number: "8",
    title: { en: "Rest day", ar: "يوم الراحة" },
    body: {
      en: "The domestic worker shall be given a one-day weekly rest.",
      ar: "تُعطى العاملة المنزلية راحة أسبوعية مدتها يوم واحد.",
    },
  },
  {
    number: "9",
    title: { en: "Transportation Cost", ar: "تكلفة النقل" },
    body: {
      en: "The employer shall provide the domestic worker free transportation to the site of employment and back to the Philippines upon expiration of contract and ensure the domestic worker's timely repatriation. In case of termination for reason not attributable to the domestic worker, the employer shall bear the cost of the repatriation of the domestic worker to the Philippines.",
      ar: "يجب على صاحب العمل توفير وسيلة نقل مجانية للعاملة المنزلية إلى موقع العمل والعودة إلى الفلبين عند انتهاء العقد وضمان إعادة العاملة المنزلية إلى الوطن في الوقت المناسب. في حالة إنهاء الخدمة لسبب لا يُعزى إلى العاملة المنزلية، يتحمل صاحب العمل تكاليف إعادة العاملة المنزلية إلى الفلبين.",
    },
  },
  {
    number: "10",
    title: { en: "Accommodation and Food", ar: "السكن والغذاء" },
    body: {
      en: "The employer shall provide the domestic worker with safe, suitable and sanitary living quarters as well as adequate food or equivalent monetary allowance.",
      ar: "يجب على صاحب العمل توفير مسكن معيشة آمن ومناسب وصحي للعاملة المنزلية بالإضافة إلى طعام كافٍ أو بدل نقدي معادل.",
    },
  },
  {
    number: "11",
    title: { en: "Medical Assistance", ar: "المساعدة الطبية" },
    body: {
      en: "In the event that the domestic worker is ill, injured or unable to physically perform his/her duties, the domestic worker shall be allowed to rest and shall continue to receive his/her regular salary. The employer shall shoulder all necessary medical expenses. Health care shall be provided by the employer to the domestic worker in accordance with the regulations and instructions in force in the Kingdom of Saudi Arabia.",
      ar: "في حالة مرض العاملة المنزلية أو إصابتها أو عجزها عن أداء واجباتها جسدياً، يُسمح للعاملة المنزلية بالراحة ويستمر في تلقي راتبه/ها العادي. يتحمل صاحب العمل جميع النفقات الطبية اللازمة. يقدم صاحب العمل الرعاية الصحية للعاملة المنزلية وفقاً للأنظمة والتعليمات المعمول بها في المملكة العربية السعودية.",
    },
  },
  {
    number: "12",
    title: {
      en: "Annual Leave and Sick Leave",
      ar: "الإجازة السنوية والإجازة المرضية",
    },
    body: {
      en: "The domestic worker is entitled to return to the Philippines to spend his/her paid annual leave of thirty (30) days for every two years of service with round-trip economy class ticket. In case of his/her desire to continue working with the employer, he/she is entitled to an additional one (1) month salary. Furthermore, the domestic worker shall be entitled to paid sick leave of thirty (30) days in the event the domestic worker is issued a medical report as per the regulations and instructions that are in force in KSA. Immediately upon request of the domestic worker, the employer shall bring the domestic worker to a professional health care provider for evaluation and issuance of the medical report.",
      ar: "يحق للعاملة المنزلية العودة إلى الفلبين لقضاء إجازته/ها السنوية المدفوعة الأجر لمدة ثلاثين (30) يوماً لكل عامين من الخدمة بتذكرة ذهاب وعودة على الدرجة السياحية. في حالة رغبته/ها في مواصلة العمل مع صاحب العمل، يحق له/ها الحصول على راتب شهر إضافي واحد (1). علاوة على ذلك، يحق للعاملة المنزلية الحصول على إجازة مرضية مدفوعة الأجر لمدة ثلاثين (30) يوماً في حالة إصدار تقرير طبي للعاملة المنزلية وفقاً للأنظمة والتعليمات المعمول بها في المملكة العربية السعودية. على صاحب العمل بناءً على طلب العاملة المنزلية فوراً إحضار العاملة المنزلية إلى مقدم رعاية صحية مهني لتقييمه/ها وإصدار التقرير الطبي.",
    },
  },
  {
    number: "13",
    title: { en: "Repatriation of Remains", ar: "إعادة الرفات إلى الوطن" },
    body: {
      en: "In case of death, the employer is responsible for the repatriation of the domestic worker's remains and personal belongings to the Republic of the Philippines as soon as legally possible and without undue delay. In case repatriation of remains is not possible, the same may be disposed of after obtaining the approval of one of the domestic worker's next of kin or by the Philippine Embassy.",
      ar: "في حالة الوفاة، يكون صاحب العمل مسؤولاً عن إعادة رفات العاملة المنزلية وممتلكاتها الشخصية إلى جمهورية الفلبين في أقرب وقت ممكن قانوناً ودون تأخير غير مبرر. في حالة تعذر إعادة الرفات إلى الوطن، يجوز التصرف فيها بعد الحصول على موافقة أحد أقرباء العاملة المنزلية أو من السفارة الفلبينية.",
    },
  },
  {
    number: "14",
    title: { en: "Dispute Resolution", ar: "حل النزاع" },
    body: {
      en: "In case of dispute between the employer and the domestic worker, either party may refer the dispute to the appropriate KSA government office for Domestic Workers Dispute Settlement for the possible amicable settlement (mediation) of financial claims, or, failing that, through compulsory arbitration.",
      ar: "في حال وجود نزاع بين صاحب العمل والعاملة المنزلية، يجوز لأي من الطرفين إحالة النزاع إلى المكتب الحكومي المناسب في المملكة العربية السعودية لتسوية نزاعات العمالة المنزلية من أجل التسوية الودية المحتملة (الوساطة) للمطالبات المالية، أو في حالة عدم ذلك من خلال التحكيم الإجباري.",
    },
  },
  {
    number: "15",
    title: {
      en: "Transfer and Termination of Contract",
      ar: "نقل وإنهاء العقد",
    },
    body: {
      en: "Should he/she desire, the domestic worker shall be allowed to immediately transfer to another employer under any of the following circumstances:",
      ar: "يُسمح للعاملة المنزلية في حال رغبته/ها بالانتقال فوراً إلى صاحب عمل آخر في أي من الظروف التالية:",
    },
    items: [
      {
        en: "Upon expiration of the contract;",
        ar: "عند انتهاء العقد؛",
      },
      {
        en: "The employer delayed in paying the domestic worker's wages for three consecutive or separate wages without a reason related to the worker;",
        ar: "تأخر صاحب العمل في دفع أجور العاملة المنزلية عن ثلاثة أجور متتالية أو منفصلة دون سبب يتعلق بالعامل؛",
      },
      {
        en: "The employer fails to receive the domestic worker at the port of arrival, or within fifteen (15) days from the shelter from the date of his/her arrival to the Kingdom;",
        ar: "عدم استقبال صاحب العمل للعاملة المنزلية في ميناء الوصول، أو خلال خمسة عشر (15) يوماً من الملجأ من تاريخ وصوله/ها إلى المملكة؛",
      },
      {
        en: "The employer fails to obtain a residence permit for the domestic worker, or to renew the same within thirty (30) days after its expiration;",
        ar: "عدم حصول صاحب العمل على تصريح إقامة للعاملة المنزلية، أو تجديده خلال ثلاثين (30) يوماً بعد انتهاء صلاحيته؛",
      },
      {
        en: "When the domestic worker's services are rented out to others without his/her knowledge and written consent;",
        ar: "عندما تُؤجر خدمات العاملة المنزلية للغير دون علمه/ها وموافقته/ها الخطية؛",
      },
      {
        en: "When the domestic worker is assigned to work for others who are not relatives of the employer up to the second degree;",
        ar: "عندما يتم تكليف العاملة المنزلية بالعمل لدى آخرين ليسوا من أقارب صاحب العمل حتى الدرجة الثانية؛",
      },
      {
        en: "When the domestic worker is assigned to work that threatens his/her health and safety;",
        ar: "عندما يتم تكليف العاملة المنزلية بعمل يهدد صحته/ها وسلامته/ها؛",
      },
      {
        en: "When the employer or any of his family members mistreats the domestic worker;",
        ar: "عندما يسيء صاحب العمل أو أي من أفراد أسرته معاملة العاملة المنزلية؛",
      },
      {
        en: "When the employer fails to act immediately on the complaint of the domestic worker;",
        ar: "عندما يخفق صاحب العمل في التصرف فوراً بناءً على شكوى العاملة المنزلية؛",
      },
      {
        en: "When there is a complaint by the domestic worker against the employer, and the employer prolonged the period of consideration, provided that the worker has not caused or contributed to the prolongation of the complaint also;",
        ar: "عند وجود شكوى من العاملة المنزلية ضد صاحب العمل وقام صاحب العمل بإطالة فترة النظر فيها، بشرط ألا يكون العامل قد تسبب أو ساهم في إطالة الشكوى أيضاً؛",
      },
      {
        en: "When the employer submits an incorrect notification of absence against the domestic worker;",
        ar: "عندما يقدم صاحب العمل إخطاراً غير صحيح بالغياب ضد العاملة المنزلية؛",
      },
      {
        en: "When the employer or his representative fails to attend two sessions called by the competent authority to hear the complaint submitted by the domestic worker;",
        ar: "عندما يتخلف صاحب العمل أو من ينوب عنه عن حضور جلستين تدعوهما السلطة المختصة للنظر في الشكوى المقدمة من العاملة المنزلية؛",
      },
      {
        en: "Upon the recommendation of the competent authority, during the pendency of the complaint filed by the domestic worker, in order to avoid any potential damages that may be incurred by the domestic worker;",
        ar: "بناءً على توصية من السلطة المختصة أثناء تعليق الشكوى المقدمة من العاملة المنزلية من أجل تجنب أي ضرر محتمل قد تتعرض له العاملة المنزلية؛",
      },
      {
        en: "In case of the absence of the employer due to his travel, imprisonment, or death, or for any other reason that results in the inability to pay the domestic worker's wages for a period of three (3) consecutive months; and",
        ar: "في حالة غياب صاحب العمل بسبب سفره أو سجنه أو وفاته أو لأي سبب آخر يترتب عليه عدم القدرة على دفع أجور العاملة المنزلية لمدة ثلاثة (3) أشهر متتالية؛ و",
      },
      {
        en: "Any other individual or general cases decided by the Minister of Human Resources and Social Development.",
        ar: "أي حالات فردية أو عامة أخرى يقررها وزير الموارد البشرية والتنمية الاجتماعية.",
      },
    ],
  },
  {
    number: "15b",
    title: { en: "", ar: "" },
    body: {
      en: "The domestic worker may immediately terminate the contract for any of the following just causes:",
      ar: "يجوز للعاملة المنزلية إنهاء العقد فوراً لأي من الأسباب العادلة التالية:",
    },
    items: [
      {
        en: "When the worker is maltreated by the employer;",
        ar: "عندما يتعرض العامل لسوء المعاملة من قبل صاحب العمل؛",
      },
      {
        en: "When the employer violates the terms and conditions of the contract; and",
        ar: "عندما ينتهك صاحب العمل شروط وأحكام العقد؛ و",
      },
      {
        en: "When the employer commits any of the following acts: deliberate nonpayment of salary, physical or sexual molestation and physical assault.",
        ar: "عندما يرتكب صاحب العمل أياً من الأفعال التالية: عدم دفع الراتب عمداً، والتحرش البدني أو الجنسي والاعتداء البدني.",
      },
    ],
  },
  {
    number: "16",
    title: { en: "Special Provisions", ar: "أحكام خاصة" },
    body: {
      en: "The following special provisions shall apply:",
      ar: "تطبق الأحكام الخاصة التالية:",
    },
    items: [
      {
        en: "The responsibility of informing the employer regarding the departure and arrival of the domestic worker in the Kingdom of Saudi Arabia shall be that of the Philippine recruitment agency in coordination with Saudi recruitment agency.",
        ar: "تقع مسؤولية إبلاغ صاحب العمل بشأن مغادرة ووصول العاملة المنزلية إلى المملكة العربية السعودية على عاتق وكالة الاستقدام الفلبينية بالتنسيق مع وكالة الاستقدام السعودية.",
      },
      {
        en: "The employer and his family members, and the domestic worker shall treat one another with respect and dignity.",
        ar: "يعامل صاحب العمل وأفراد أسرته والعاملة المنزلية بعضهم بعضاً باحترام وكرامة.",
      },
      {
        en: "The domestic worker shall work solely for the employer and his immediate household.",
        ar: "يجب على العاملة المنزلية أن يعمل فقط لدى صاحب العمل أو أسرته المباشرة.",
      },
      {
        en: "The employer shall not deduct any amount from the regular salary of domestic worker.",
        ar: "لا يجوز لصاحب العمل خصم أي مبلغ من الراتب العادي للعاملة المنزلية.",
      },
      {
        en: "The employer shall pay the cost of domestic worker's residence permit (iqama), exit/re-entry visa, and the final exit visa, including the renewals and penalties resulting from delays.",
        ar: "يدفع صاحب العمل تكلفة إقامة العاملة المنزلية (الإقامة)، وتأشيرة الخروج/العودة، وتأشيرة الخروج النهائي، بما في ذلك التجديد والعقوبات الناتجة عن التأخير.",
      },
      {
        en: "The passport and work permit (iqama) of the worker shall remain in his/her possession. Under no circumstances shall the employer hold in his/her possession the passport, iqama and other personal documents of the domestic worker.",
        ar: "يبقى جواز سفر العامل وتصريح عمله في حوزته/ها. لا يجوز لصاحب العمل تحت أي ظرف من الظروف أن يحتفظ بجواز السفر والإقامة والوثائق الشخصية الأخرى للعاملة المنزلية.",
      },
      {
        en: "The domestic worker shall be allowed to freely communicate with his/her family and the Philippine Embassy/Consulate on his/her personal expense or account.",
        ar: "يُسمح للعاملة المنزلية بالاتصال بحرية بأسرته/ها والقنصلية/السفارة الفلبينية على نفقته/ها الشخصية أو حسابه/ها.",
      },
      {
        en: "The employer shall explain to the members of his household the provisions of this contract and ensure that these are observed.",
        ar: "على صاحب العمل أن يشرح لأفراد أسرته أحكام هذا العقد وأن يحرص على مراعاتها.",
      },
      {
        en: "In accordance with the laws and regulations of the Kingdom protecting human rights and establishing protections against abuse, the employer shall educate himself/herself, the members of his/her family, and the domestic workers in their employ of: (i) the rights of domestic workers, including the right to equality, non-discrimination, and to protection from abuse; and (ii) everyone's obligation to immediately report cases of abuse that come to their knowledge to the competent authorities.",
        ar: "وفقاً لأنظمة المملكة التي تحمي حقوق الإنسان وتضع تدابير الحماية من سوء المعاملة، يجب على صاحب العمل تثقيف نفسه وأفراد أسرته والعاملات المنزليات اللواتي يعملن لديهم بما يلي: (1) حقوق العاملات المنزليات بما في ذلك الحق في المساواة وعدم التمييز والحماية من الانتهاكات؛ و(2) التزام الجميع بالإبلاغ فوراً عن حالات الإساءة التي تصل إلى علمهم إلى السلطات المختصة.",
      },
    ],
  },
  {
    number: "17",
    title: { en: "Amendments", ar: "التعديلات" },
    body: {
      en: "Any provision of this Standard Employment Contract may be altered, amended or substituted through the Saudi–Philippine Joint Technical Working Committee.",
      ar: "يجوز تغيير أي حكم من أحكام عقد العمل الموحد هذا أو تعديله أو استبداله من خلال لجنة العمل الفنية السعودية الفلبينية المشتركة.",
    },
  },
  {
    number: "18",
    title: { en: "Emergency Repatriation", ar: "الإعادة في حالات الطوارئ" },
    body: {
      en: "The worker shall be repatriated at the employer's expense in the event of war, civil disturbance or major natural calamity, pandemic or other analogous circumstances or in case the worker suffers from serious illness or work injury medically proven to render him/her incapable of completing the contract.",
      ar: "يُعاد العامل إلى وطنه على نفقة صاحب العمل في حالة الحرب أو الاضطرابات المدنية أو الكوارث الطبيعية الكبرى أو الجائحة أو غيرها من الظروف المماثلة أو في حالة تعرض العامل لمرض خطير أو إصابة عمل يثبت طبياً أنها تجعله/ها غير قادر على إكمال العقد.",
    },
  },
  {
    number: "19",
    title: {
      en: "Proof of Salary Payment upon Return",
      ar: "إثبات دفع الرواتب عند العودة",
    },
    body: {
      en: "After the expiration of the contract and the domestic worker desire to return to the Philippines, the employer and/or the Saudi Recruitment Agency shall present to the MWO the proof of full payment of salaries of the worker. Such bank statement and proof of settlement may be submitted as evidence in the Philippines and in the KSA.",
      ar: "بعد انتهاء العقد ورغبة العاملة المنزلية في العودة إلى الفلبين، يجب على صاحب العمل و/أو وكالة الاستقدام السعودية أن تقدم إلى وزارة العمل دليلاً على الدفع الكامل لرواتب العاملة. يمكن تقديم هذا البيان المصرفي وإثبات التسوية كدليل في الفلبين والمملكة العربية السعودية.",
    },
  },
  {
    number: "20",
    title: { en: "Renewal", ar: "التجديد" },
    body: {
      en: "This contract may be renewed upon the agreement of the worker and his/her employer. Should the contract be renewed, a copy of the renewed iqama and proof of full payment of salaries shall be submitted to the MWO/Philippine Embassy/Consulate by the employer or Saudi recruitment agency.",
      ar: "يجوز تجديد هذا العقد بموافقة العامل وصاحب العمل. في حالة تجديد العقد، يجب تقديم نسخة من الإقامة المجددة وإثبات الدفع الكامل للرواتب إلى MWO / السفارة / القنصلية الفلبينية من قبل صاحب العمل أو وكالة التوظيف السعودية.",
    },
  },
  {
    number: "21",
    title: { en: "Language of Contract", ar: "لغة العقد" },
    body: {
      en: "This contract shall be written in two original copies in the English and Arabic text, both copies being equally authentic.",
      ar: "يُكتب هذا العقد في نسختين أصليتين بالنص الإنجليزي والعربي، على أن تكون النسختان متساويتين في الحجية.",
    },
  },
];

export const ANNEX_DUTIES: BilingualText[] = [
  {
    en: "Perform household chores such as cleaning, cooking, laundry, and ironing as assigned by the employer.",
    ar: "أداء الأعمال المنزلية مثل التنظيف والطهي والغسيل والكي حسب تكليف صاحب العمل.",
  },
  {
    en: "Care for children, elderly, or persons with special needs when included in the agreed scope of work.",
    ar: "رعاية الأطفال أو كبار السن أو ذوي الاحتياجات الخاصة عند إدراج ذلك في نطاق العمل المتفق عليه.",
  },
  {
    en: "Maintain cleanliness and order of the employer's residence and workplace within the household.",
    ar: "المحافظة على نظافة وترتيب مسكن صاحب العمل ومكان العمل داخل المنزل.",
  },
  {
    en: "Respect the privacy, culture, religion, and regulations of the employer's household and the Kingdom.",
    ar: "احترام خصوصية وثقافة ودين وأنظمة أسرة صاحب العمل والمملكة.",
  },
  {
    en: "Other lawful domestic duties mutually agreed upon and consistent with Annex A and this Contract.",
    ar: "واجبات منزلية مشروعة أخرى متفق عليها ومتوافقة مع الملحق أ وهذا العقد.",
  },
];
