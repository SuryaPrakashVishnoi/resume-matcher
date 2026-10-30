/* ==============================================
   RESUMATCH v2 — DATA LAYER
   Real companies with career links, skill taxonomy,
   sample resumes
   ============================================== */

// ---- Skill Taxonomy ----
const SKILL_TAXONOMY = {
    python:['python','python3','py','python programming'],
    javascript:['javascript','js','ecmascript','es6','es2015','vanilla js'],
    typescript:['typescript','ts'],
    java:['java','j2ee','jdk','jre','core java','advanced java'],
    csharp:['c#','csharp','c sharp','.net','dotnet','asp.net'],
    cpp:['c++','cpp','c plus plus'],
    c_lang:['c language','c programming','embedded c'],
    ruby:['ruby','rb'],
    go:['go','golang'],
    rust:['rust','rust-lang'],
    swift:['swift','swiftui'],
    kotlin:['kotlin','kt'],
    php:['php','laravel','wordpress'],
    r_lang:['r language','r programming','r studio','rstudio'],
    scala:['scala'],
    dart:['dart','flutter'],
    html:['html','html5','semantic html'],
    css:['css','css3','sass','scss','less','tailwind','tailwindcss','bootstrap','styled-components','material ui','chakra'],
    react:['react','reactjs','react.js','react native','react hooks','redux'],
    angular:['angular','angularjs','angular.js'],
    vue:['vue','vuejs','vue.js','nuxt','nuxtjs'],
    nextjs:['next','nextjs','next.js'],
    nodejs:['node','nodejs','node.js','express','expressjs','express.js','nestjs','koa'],
    django:['django','django rest framework','drf','django rest'],
    flask:['flask','fastapi','fast api'],
    spring:['spring','spring boot','springboot','spring mvc','spring framework'],
    rails:['rails','ruby on rails','ror'],
    sql:['sql','mysql','postgresql','postgres','sqlite','tsql','plsql','pl/sql','oracle db','database','dbms','rdbms','relational database'],
    mongodb:['mongodb','mongo','mongoose','nosql','no-sql'],
    redis:['redis','memcached','caching'],
    elasticsearch:['elasticsearch','elastic search','elk','kibana','logstash'],
    dynamodb:['dynamodb','dynamo db'],
    firebase:['firebase','firestore'],
    aws:['aws','amazon web services','ec2','s3','lambda','sagemaker','cloudformation','aws cloud','amazon cloud'],
    azure:['azure','microsoft azure','azure devops'],
    gcp:['gcp','google cloud','google cloud platform','bigquery','big query'],
    docker:['docker','containerization','containers','container'],
    kubernetes:['kubernetes','k8s','helm','openshift'],
    cicd:['ci/cd','ci cd','cicd','jenkins','github actions','gitlab ci','circleci','travis ci','continuous integration','continuous deployment','devops pipeline'],
    terraform:['terraform','iac','infrastructure as code','ansible','puppet','chef'],
    linux:['linux','ubuntu','centos','redhat','red hat','unix','bash','shell scripting','shell','command line','terminal'],
    git:['git','github','gitlab','bitbucket','version control','source control','svn'],
    machine_learning:['machine learning','ml','deep learning','dl','neural network','neural networks','ai','artificial intelligence','classification','regression model','random forest','xgboost','gradient boosting','svm','support vector','decision tree'],
    data_science:['data science','data analysis','data analytics','data mining','big data','data engineering','etl','data pipeline','data warehouse'],
    nlp:['nlp','natural language processing','text mining','text analytics','text classification','sentiment analysis','bert','gpt','transformer','transformers','llm','large language model','chatbot','language model'],
    computer_vision:['computer vision','cv','image processing','image recognition','object detection','yolo','opencv','image classification'],
    tensorflow:['tensorflow','tf','keras'],
    pytorch:['pytorch','torch'],
    pandas:['pandas','numpy','scipy','scikit-learn','sklearn','scikit','data manipulation'],
    spark:['spark','pyspark','apache spark','hadoop','mapreduce','hive'],
    tableau:['tableau','power bi','powerbi','data visualization','looker','metabase','grafana','dashboard'],
    statistics:['statistics','statistical analysis','hypothesis testing','regression analysis','a/b testing','ab testing','probability','bayesian','forecasting'],
    project_management:['project management','scrum','agile','kanban','jira','trello','confluence','sprint','product management','scrum master','product owner'],
    leadership:['leadership','team lead','team leader','team management','people management','mentoring','coaching'],
    communication:['communication','presentation','public speaking','stakeholder management','client management','client facing'],
    problem_solving:['problem solving','analytical thinking','critical thinking','data structures','algorithms','dsa','competitive programming','leetcode'],
    cybersecurity:['cybersecurity','cyber security','information security','infosec','penetration testing','pentest','ethical hacking','vulnerability','soc','security analyst'],
    network_security:['network security','firewall','vpn','ids','ips','networking','tcp/ip','dns','load balancer'],
    ui_ux:['ui/ux','ui ux','user experience','user interface','ux design','ui design','figma','sketch','adobe xd','wireframe','prototype','prototyping','usability','interaction design','design thinking'],
    graphic_design:['graphic design','photoshop','illustrator','canva','adobe creative','visual design','branding'],
    testing:['testing','unit testing','integration testing','selenium','cypress','jest','pytest','qa','quality assurance','test automation','manual testing'],
    api:['api','rest api','restful','graphql','grpc','soap','microservices','micro services','api gateway','postman','swagger'],
    mobile:['mobile','android','ios','react native','flutter','mobile development','mobile app','swift','kotlin']
};

// ---- Company Database ----
const COMPANIES = {
    google: { name:'Google', url:'https://careers.google.com/', color:'#4285F4', letter:'G' },
    microsoft: { name:'Microsoft', url:'https://careers.microsoft.com/', color:'#00A4EF', letter:'M' },
    amazon: { name:'Amazon', url:'https://www.amazon.jobs/', color:'#FF9900', letter:'A' },
    meta: { name:'Meta', url:'https://www.metacareers.com/', color:'#0668E1', letter:'M' },
    apple: { name:'Apple', url:'https://jobs.apple.com/', color:'#555555', letter:'A' },
    flipkart: { name:'Flipkart', url:'https://www.flipkartcareers.com/', color:'#F8D210', letter:'F' },
    swiggy: { name:'Swiggy', url:'https://careers.swiggy.com/', color:'#FC8019', letter:'S' },
    zomato: { name:'Zomato', url:'https://www.zomato.com/careers', color:'#E23744', letter:'Z' },
    razorpay: { name:'Razorpay', url:'https://razorpay.com/careers/', color:'#072654', letter:'R' },
    phonepe: { name:'PhonePe', url:'https://www.phonepe.com/careers/', color:'#5F259F', letter:'P' },
    paytm: { name:'Paytm', url:'https://paytm.com/careers/', color:'#00BAF2', letter:'P' },
    tcs: { name:'TCS', url:'https://www.tcs.com/careers', color:'#0066B3', letter:'T' },
    infosys: { name:'Infosys', url:'https://www.infosys.com/careers/', color:'#007CC3', letter:'I' },
    wipro: { name:'Wipro', url:'https://careers.wipro.com/', color:'#441E8E', letter:'W' },
    hcl: { name:'HCL Tech', url:'https://www.hcltech.com/careers', color:'#0D2F7E', letter:'H' },
    techmahindra: { name:'Tech Mahindra', url:'https://careers.techmahindra.com/', color:'#004B87', letter:'T' },
    accenture: { name:'Accenture', url:'https://www.accenture.com/in-en/careers', color:'#A100FF', letter:'A' },
    deloitte: { name:'Deloitte', url:'https://www2.deloitte.com/in/en/careers.html', color:'#86BC25', letter:'D' },
    cognizant: { name:'Cognizant', url:'https://careers.cognizant.com/', color:'#1A4F8B', letter:'C' },
    capgemini: { name:'Capgemini', url:'https://www.capgemini.com/in-en/careers/', color:'#0070AD', letter:'C' },
    nvidia: { name:'NVIDIA', url:'https://www.nvidia.com/en-us/about-nvidia/careers/', color:'#76B900', letter:'N' },
    salesforce: { name:'Salesforce', url:'https://www.salesforce.com/company/careers/', color:'#00A1E0', letter:'S' },
    oracle: { name:'Oracle', url:'https://www.oracle.com/in/careers/', color:'#C74634', letter:'O' },
    ibm: { name:'IBM', url:'https://www.ibm.com/careers', color:'#054ADA', letter:'I' },
    uber: { name:'Uber', url:'https://www.uber.com/us/en/careers/', color:'#000000', letter:'U' },
    atlassian: { name:'Atlassian', url:'https://www.atlassian.com/company/careers', color:'#0052CC', letter:'A' },
    freshworks: { name:'Freshworks', url:'https://www.freshworks.com/company/careers/', color:'#F36C3D', letter:'F' },
    zoho: { name:'Zoho', url:'https://www.zoho.com/careers.html', color:'#D4382C', letter:'Z' },
    cred: { name:'CRED', url:'https://careers.cred.club/', color:'#1E1E2C', letter:'C' },
    meesho: { name:'Meesho', url:'https://meesho.io/careers', color:'#EC2D7A', letter:'M' },
    ola: { name:'Ola', url:'https://www.olacabs.com/careers', color:'#34A853', letter:'O' },
    myntra: { name:'Myntra', url:'https://www.myntra.com/careers', color:'#FF3F6C', letter:'M' },
    jpmorganchase: { name:'JP Morgan', url:'https://careers.jpmorgan.com/', color:'#003A70', letter:'J' },
    goldmansachs: { name:'Goldman Sachs', url:'https://www.goldmansachs.com/careers/', color:'#6AA0D5', letter:'G' },
    intuit: { name:'Intuit', url:'https://www.intuit.com/careers/', color:'#365EBF', letter:'I' },
    adobe: { name:'Adobe', url:'https://www.adobe.com/careers.html', color:'#FF0000', letter:'A' },
    servicenow: { name:'ServiceNow', url:'https://www.servicenow.com/careers.html', color:'#81B5A1', letter:'S' },
    vmware: { name:'VMware', url:'https://careers.vmware.com/', color:'#696566', letter:'V' },
    samsung: { name:'Samsung R&D', url:'https://research.samsung.com/careers', color:'#1428A0', letter:'S' },
    qualcomm: { name:'Qualcomm', url:'https://www.qualcomm.com/company/careers', color:'#3253DC', letter:'Q' }
};

// ---- Job Database with Real Companies ----
const JOB_DATABASE = [
    {
        id:'sde',
        title:'Software Development Engineer',
        level:'Mid-Level',
        salary:'₹8L – ₹30L',
        location:'Bangalore, Hyderabad, Remote',
        requiredSkills:['python','javascript','sql','git','problem_solving'],
        preferredSkills:['aws','docker','react','nodejs','cicd','api','testing'],
        companies:['google','amazon','microsoft','flipkart','razorpay','tcs','infosys','accenture','cred','atlassian'],
        minExp:2, maxExp:6
    },
    {
        id:'frontend',
        title:'Frontend Developer',
        level:'Mid-Level',
        salary:'₹6L – ₹22L',
        location:'Bangalore, Mumbai, Remote',
        requiredSkills:['javascript','html','css','react'],
        preferredSkills:['typescript','nextjs','nodejs','git','ui_ux','testing'],
        companies:['flipkart','swiggy','zomato','freshworks','myntra','meesho','adobe','cred','zoho'],
        minExp:1, maxExp:5
    },
    {
        id:'backend',
        title:'Backend Engineer',
        level:'Mid-Level',
        salary:'₹8L – ₹32L',
        location:'Bangalore, Pune, Hyderabad',
        requiredSkills:['python','sql','git','linux','api'],
        preferredSkills:['django','flask','docker','aws','redis','mongodb','cicd'],
        companies:['google','amazon','razorpay','phonepe','uber','atlassian','salesforce','jpmorganchase'],
        minExp:2, maxExp:7
    },
    {
        id:'fullstack',
        title:'Full Stack Developer',
        level:'Mid-Level',
        salary:'₹10L – ₹35L',
        location:'Bangalore, Delhi NCR, Remote',
        requiredSkills:['javascript','react','nodejs','sql'],
        preferredSkills:['typescript','mongodb','docker','aws','git','cicd','api'],
        companies:['flipkart','razorpay','cred','freshworks','meesho','swiggy','intuit','paytm'],
        minExp:2, maxExp:6
    },
    {
        id:'data-scientist',
        title:'Data Scientist',
        level:'Mid-Level',
        salary:'₹12L – ₹40L',
        location:'Bangalore, Hyderabad, Mumbai',
        requiredSkills:['python','machine_learning','statistics','sql','pandas'],
        preferredSkills:['tensorflow','pytorch','spark','r_lang','tableau','data_science','nlp'],
        companies:['google','amazon','microsoft','flipkart','swiggy','nvidia','ibm','goldmansachs','uber'],
        minExp:2, maxExp:7
    },
    {
        id:'ml-engineer',
        title:'Machine Learning Engineer',
        level:'Senior',
        salary:'₹18L – ₹55L',
        location:'Bangalore, Remote',
        requiredSkills:['python','machine_learning','tensorflow','sql','docker'],
        preferredSkills:['pytorch','aws','spark','nlp','computer_vision','kubernetes','api'],
        companies:['google','nvidia','amazon','microsoft','meta','samsung','qualcomm','flipkart'],
        minExp:3, maxExp:10
    },
    {
        id:'data-analyst',
        title:'Data Analyst',
        level:'Entry / Mid',
        salary:'₹4L – ₹15L',
        location:'Pan India, Remote',
        requiredSkills:['sql','statistics','python'],
        preferredSkills:['tableau','pandas','r_lang','data_science','machine_learning'],
        companies:['tcs','infosys','accenture','deloitte','cognizant','wipro','paytm','zoho','capgemini'],
        minExp:0, maxExp:3
    },
    {
        id:'devops',
        title:'DevOps Engineer',
        level:'Mid-Level',
        salary:'₹10L – ₹35L',
        location:'Bangalore, Pune, Remote',
        requiredSkills:['linux','docker','cicd','aws'],
        preferredSkills:['kubernetes','terraform','python','git','azure','gcp'],
        companies:['amazon','microsoft','google','flipkart','razorpay','atlassian','servicenow','vmware','oracle'],
        minExp:2, maxExp:7
    },
    {
        id:'cloud-architect',
        title:'Cloud Solutions Architect',
        level:'Senior',
        salary:'₹22L – ₹65L',
        location:'Bangalore, Mumbai, Hyderabad',
        requiredSkills:['aws','docker','linux','python'],
        preferredSkills:['kubernetes','terraform','azure','gcp','cicd','network_security'],
        companies:['amazon','microsoft','google','accenture','deloitte','ibm','oracle','hcl','tcs'],
        minExp:5, maxExp:15
    },
    {
        id:'mobile',
        title:'Mobile App Developer',
        level:'Mid-Level',
        salary:'₹8L – ₹28L',
        location:'Bangalore, Delhi NCR, Remote',
        requiredSkills:['javascript','react','mobile'],
        preferredSkills:['kotlin','swift','dart','firebase','git','testing'],
        companies:['flipkart','swiggy','phonepe','paytm','ola','myntra','zomato','meesho','cred'],
        minExp:1, maxExp:5
    },
    {
        id:'security',
        title:'Cybersecurity Analyst',
        level:'Mid-Level',
        salary:'₹8L – ₹25L',
        location:'Bangalore, Hyderabad, Pune',
        requiredSkills:['cybersecurity','linux','network_security'],
        preferredSkills:['python','aws','docker','testing'],
        companies:['tcs','wipro','infosys','hcl','ibm','accenture','deloitte','jpmorganchase','goldmansachs'],
        minExp:2, maxExp:7
    },
    {
        id:'uiux',
        title:'UI/UX Designer',
        level:'Mid-Level',
        salary:'₹6L – ₹22L',
        location:'Bangalore, Mumbai, Remote',
        requiredSkills:['ui_ux','communication'],
        preferredSkills:['html','css','javascript','graphic_design'],
        companies:['flipkart','swiggy','myntra','cred','freshworks','adobe','meesho','phonepe','zoho'],
        minExp:1, maxExp:5
    },
    {
        id:'pm',
        title:'Technical Project Manager',
        level:'Senior',
        salary:'₹15L – ₹45L',
        location:'Pan India',
        requiredSkills:['project_management','leadership','communication'],
        preferredSkills:['problem_solving','sql','python','api'],
        companies:['tcs','infosys','wipro','accenture','deloitte','cognizant','capgemini','hcl','techmahindra','ibm'],
        minExp:5, maxExp:15
    },
    {
        id:'nlp-eng',
        title:'NLP / AI Engineer',
        level:'Mid-Level',
        salary:'₹14L – ₹45L',
        location:'Bangalore, Remote',
        requiredSkills:['python','nlp','machine_learning'],
        preferredSkills:['tensorflow','pytorch','statistics','docker','aws','api'],
        companies:['google','microsoft','amazon','nvidia','meta','samsung','flipkart','freshworks'],
        minExp:2, maxExp:7
    },
    {
        id:'java-dev',
        title:'Java Developer',
        level:'Mid-Level',
        salary:'₹6L – ₹25L',
        location:'Bangalore, Chennai, Pune',
        requiredSkills:['java','sql','git'],
        preferredSkills:['spring','docker','aws','linux','mongodb','api','testing'],
        companies:['tcs','infosys','wipro','cognizant','accenture','oracle','ibm','jpmorganchase','goldmansachs','capgemini'],
        minExp:2, maxExp:8
    },
    {
        id:'qa',
        title:'QA / Test Automation Engineer',
        level:'Mid-Level',
        salary:'₹5L – ₹18L',
        location:'Pan India',
        requiredSkills:['testing','python','git'],
        preferredSkills:['javascript','api','cicd','sql','linux'],
        companies:['tcs','infosys','wipro','accenture','cognizant','capgemini','hcl','techmahindra','zoho'],
        minExp:1, maxExp:5
    }
];

// ---- Sample Resumes ----
const SAMPLE_RESUMES = [
    {
        id:'s1', name:'Aisha Patel', title:'Full Stack Developer', color:'#0d9488',
        summary:'4 yrs · React, Node, AWS',
        text:`AISHA PATEL
Full Stack Developer | Bangalore, India
Email: aisha.patel@email.com | Phone: +91-9876543210

PROFESSIONAL SUMMARY
Enthusiastic Full Stack Developer with 4 years of experience building scalable web applications. Proficient in React, Node.js, Python, and cloud technologies. Strong believer in clean code and test-driven development.

WORK EXPERIENCE

Software Engineer — TechStart Solutions, Bangalore
June 2022 – Present (2 years)
• Built and maintained 3 production React applications serving 50,000+ users
• Designed RESTful APIs using Node.js and Express, reducing response time by 40%
• Implemented CI/CD pipelines with GitHub Actions, cutting deployment time from 2 hours to 15 minutes
• Managed PostgreSQL and MongoDB databases, optimized slow queries improving performance by 60%
• Collaborated with UX team to redesign dashboard, increasing user engagement by 25%

Junior Developer — WebCraft Agency, Pune
July 2020 – May 2022 (2 years)
• Developed responsive websites for 15+ clients using HTML, CSS, JavaScript, and React
• Built backend services with Python Django and integrated third-party REST APIs
• Deployed applications on AWS EC2, S3, RDS and managed Linux servers
• Wrote unit tests achieving 85% code coverage using Jest and pytest

EDUCATION
B.Tech in Computer Science — MIT Pune (2020) — CGPA: 8.5/10

SKILLS
Languages: JavaScript, TypeScript, Python, SQL, HTML, CSS
Frameworks: React, Next.js, Node.js, Express, Django
Databases: PostgreSQL, MongoDB, Redis
Tools: Git, Docker, AWS, GitHub Actions, Jira, Figma
Concepts: REST APIs, Microservices, Agile/Scrum, Unit Testing

CERTIFICATIONS
• AWS Solutions Architect – Associate (2023)
• MongoDB Associate Developer (2022)`
    },
    {
        id:'s2', name:'Rahul Krishnan', title:'Data Scientist', color:'#f97316',
        summary:'3 yrs · ML, TensorFlow, NLP',
        text:`RAHUL KRISHNAN
Data Scientist | Hyderabad, India
Email: rahul.k@email.com

PROFESSIONAL SUMMARY
Data Scientist with 3 years of experience in machine learning, statistical analysis, and data-driven decision making. Skilled in Python, TensorFlow, and big data technologies.

WORK EXPERIENCE

Data Scientist — DataMinds Analytics, Hyderabad
March 2022 – Present (2.5 years)
• Built customer churn prediction model using XGBoost achieving 91% accuracy, saving ₹2Cr annually
• Developed NLP pipeline for sentiment analysis processing 100K+ reviews daily using BERT
• Created automated reporting dashboards in Tableau serving 50+ stakeholders
• Led A/B testing framework implementation, running 20+ experiments per quarter
• Managed data pipelines using Apache Spark processing 500GB+ daily

Data Analyst — InfoTech Corp, Chennai
June 2021 – February 2022 (9 months)
• Analyzed sales data using SQL and Python, identifying trends that increased revenue by 15%
• Built predictive models for inventory management using scikit-learn
• Created Power BI dashboards for C-suite executives

Research Intern — IIT Hyderabad
January 2021 – May 2021
• Published paper on text classification using transformer models

EDUCATION
M.Tech in Data Science — IIT Hyderabad (2021)
B.Tech in Computer Science — NIT Warangal (2019)

SKILLS
Languages: Python, R, SQL, Java
ML/DL: TensorFlow, PyTorch, scikit-learn, XGBoost, BERT, GPT, Neural Networks
Data: Pandas, NumPy, Spark, Hadoop, Airflow
Visualization: Tableau, Power BI, Matplotlib
Cloud: AWS SageMaker, S3, EC2, GCP BigQuery
Statistics: Hypothesis Testing, Regression Analysis, Bayesian Methods, A/B Testing

CERTIFICATIONS
• Google Professional Data Engineer (2023)
• Deep Learning Specialization — Coursera (2022)`
    },
    {
        id:'s3', name:'Priya Sharma', title:'DevOps Engineer', color:'#8b5cf6',
        summary:'5 yrs · AWS, K8s, Terraform',
        text:`PRIYA SHARMA
Senior DevOps Engineer | Pune, India
Email: priya.sharma@email.com

PROFESSIONAL SUMMARY
Senior DevOps Engineer with 5 years of experience in cloud infrastructure, automation, and CI/CD pipeline management. Expert in AWS, Kubernetes, and Infrastructure as Code.

WORK EXPERIENCE

Senior DevOps Engineer — CloudScale Technologies, Pune
April 2022 – Present (2.5 years)
• Architected and managed Kubernetes clusters on AWS EKS serving 200+ microservices
• Reduced cloud costs by 35% through rightsizing and spot instances
• Implemented Terraform IaC for 100% infrastructure automation across 3 AWS accounts
• Designed disaster recovery strategy achieving 99.99% uptime SLA
• Mentored team of 4 junior DevOps engineers

DevOps Engineer — NetSoft Solutions, Bangalore
July 2020 – March 2022 (20 months)
• Built CI/CD pipelines using Jenkins and GitLab CI for 30+ projects
• Containerized 25 applications with Docker
• Implemented monitoring with Prometheus, Grafana, and PagerDuty
• Managed Linux servers (Ubuntu, CentOS) across production environments

System Administrator — TechInfra Pvt Ltd, Mumbai
June 2019 – June 2020 (1 year)
• Managed 50+ Linux servers and network infrastructure
• Automated tasks with Bash and Python scripting
• Implemented backup and recovery procedures

EDUCATION
B.Tech in Information Technology — VIT Pune (2019)

SKILLS
Cloud: AWS (EC2, EKS, S3, RDS, Lambda, CloudFormation), Azure, GCP
Containers: Docker, Kubernetes, Helm, Istio
IaC: Terraform, Ansible, CloudFormation
CI/CD: Jenkins, GitLab CI, GitHub Actions, ArgoCD
Monitoring: Prometheus, Grafana, ELK Stack, Datadog
Languages: Python, Bash, Go, YAML
OS: Linux (Ubuntu, CentOS, RHEL)
Security: IAM, VPC, Security Groups, SSL/TLS

CERTIFICATIONS
• AWS Solutions Architect – Professional (2023)
• Certified Kubernetes Administrator — CKA (2022)
• HashiCorp Terraform Associate (2022)`
    },
    {
        id:'s4', name:'Vikram Reddy', title:'Fresh Graduate', color:'#ef4444',
        summary:'0 yrs · Python, React, intern exp',
        text:`VIKRAM REDDY
Aspiring Software Developer | Chennai, India
Email: vikram.reddy@email.com

PROFESSIONAL SUMMARY
Recent B.Tech Computer Science graduate with strong fundamentals in programming, data structures, and algorithms. Completed 2 internships and built multiple projects.

WORK EXPERIENCE

Software Development Intern — StartupHub, Chennai
January 2024 – May 2024 (5 months)
• Developed frontend components using React and Tailwind CSS
• Built REST API endpoints using Python Flask
• Wrote unit tests using Jest and pytest
• Participated in daily standups and sprint planning using Agile Scrum methodology

Web Development Intern — FreelanceWorks, Remote
June 2023 – August 2023 (3 months)
• Created responsive landing pages using HTML, CSS, and JavaScript
• Collaborated using Git and GitHub

EDUCATION
B.Tech in Computer Science — Anna University, Chennai (2024)
CGPA: 8.2/10
Coursework: Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks, Machine Learning

SKILLS
Languages: Python, JavaScript, C++, Java, SQL, HTML, CSS
Frameworks: React, Flask, Bootstrap, Tailwind
Databases: MySQL, MongoDB
Tools: Git, VS Code, Postman, Linux, Docker
Concepts: OOP, Data Structures, Algorithms, REST APIs, Agile, Unit Testing

PROJECTS
• Task Management App: Full-stack app with React frontend and Flask backend, MySQL database
• ML Spam Classifier: Email spam detector using Naive Bayes with 94% accuracy
• Portfolio Website: Responsive site using HTML, CSS, JavaScript

ACHIEVEMENTS
• Solved 300+ problems on LeetCode (Rating: 1650)
• Winner — College Hackathon 2023`
    },
    {
        id:'s5', name:'Meera Iyer', title:'UI/UX Designer', color:'#ec4899',
        summary:'3 yrs · Figma, React, Design Systems',
        text:`MEERA IYER
UI/UX Designer & Frontend Developer | Mumbai, India
Email: meera.iyer@email.com

PROFESSIONAL SUMMARY
Creative UI/UX Designer with 3 years of experience blending design thinking with frontend development. Skilled in Figma, user research, and building responsive interfaces with React.

WORK EXPERIENCE

UI/UX Designer — DesignFirst Studio, Mumbai
August 2022 – Present (2 years)
• Redesigned B2B SaaS dashboard, improving task completion rate by 35%
• Conducted 40+ user interviews and usability tests
• Created design system with 120+ reusable components in Figma
• Built interactive prototypes and collaborated with engineering team
• Improved WCAG 2.1 accessibility compliance from 60% to 95%

Junior Frontend Developer — WebPixel, Bangalore
June 2021 – July 2022 (14 months)
• Developed responsive web applications using React, HTML, CSS, and JavaScript
• Translated Figma designs to pixel-perfect code
• Implemented animations using CSS and Framer Motion

Design Intern — Creative Labs, Mumbai
January 2021 – May 2021
• Created wireframes and mockups for mobile applications
• Assisted in user research and competitive analysis

EDUCATION
B.Des in Interaction Design — MIT Institute of Design, Pune (2021)

SKILLS
Design: Figma, Adobe XD, Sketch, Photoshop, Illustrator, Canva
Frontend: HTML, CSS, JavaScript, React, Tailwind CSS
UX: User Research, Wireframing, Prototyping, Usability Testing, Design Thinking
Tools: Git, Jira, Notion, Storybook
Communication and Presentation Skills

CERTIFICATIONS
• Google UX Design Professional Certificate (2022)
• Interaction Design Foundation — UX Management (2023)`
    }
];

// Export
if(typeof window!=='undefined'){
    window.SKILL_TAXONOMY=SKILL_TAXONOMY;
    window.COMPANIES=COMPANIES;
    window.JOB_DATABASE=JOB_DATABASE;
    window.SAMPLE_RESUMES=SAMPLE_RESUMES;
}
