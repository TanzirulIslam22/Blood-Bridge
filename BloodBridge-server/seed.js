require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const DonationRequest = require('./models/DonationRequest');
const DonationRecord = require('./models/DonationRecord');
const DonationCamp = require('./models/DonationCamp');
const CampRegistration = require('./models/CampRegistration');
const Blog = require('./models/Blog');
const { computeBadges } = require('./utils/gamification');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env');
  process.exit(1);
}

const daysFromNow = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(10, 0, 0, 0);
  return d;
};

const HOSPITALS = [
  'Dhaka Medical College Hospital',
  'Bangabandhu Sheikh Mujib Medical University (BSMMU)',
  'Evercare Hospital Dhaka',
  'Square Hospital Limited',
  'Apollo Hospitals Dhaka',
  'Chattogram Medical College Hospital',
  'Sylhet MAG Osmani Medical College Hospital',
  'Rajshahi Medical College Hospital',
  'Khulna Medical College Hospital',
  'Barisal General Hospital',
  'Rangpur Medical College Hospital',
  'Kumudini Welfare Trust Hospital'
];

const avatar = (gender, n) =>
  gender === 'male'
    ? `https://randomuser.me/api/portraits/men/${n}.jpg`
    : `https://randomuser.me/api/portraits/women/${n}.jpg`;

const donorSeed = [
  {
    name: 'Rup',
    email: 'rup.ahmed@gmail.com',
    gender: 'female',
    avatarN: 28,
    age: 24,
    institution: 'Sir Salimullah Medical College (SSMC), Mitford',
    bloodGroup: 'O-',
    district: 'Dhaka',
    upazila: 'Dhaka Sadar',
    height: 172,
    weight: 68,
    donationCount: 12,
    urgentDonations: 4,
    campRegistrations: 3,
    attendedCamps: 3,
    lastDonationDaysAgo: 45
  },
  {
    name: 'Nusrat Jahan',
    email: 'nusrat.jahan@gmail.com',
    gender: 'female',
    avatarN: 44,
    bloodGroup: 'B+',
    district: 'Chattogram',
    upazila: 'Chattogram Sadar',
    height: 160,
    weight: 55,
    donationCount: 10,
    urgentDonations: 2,
    campRegistrations: 2,
    attendedCamps: 2,
    lastDonationDaysAgo: 200
  },
  {
    name: 'Tanvir Ahmed',
    email: 'tanvir.ahmed@gmail.com',
    gender: 'male',
    avatarN: 45,
    bloodGroup: 'A+',
    district: 'Sylhet',
    upazila: 'Sylhet Sadar',
    height: 168,
    weight: 62,
    donationCount: 8,
    urgentDonations: 3,
    campRegistrations: 2,
    attendedCamps: 1,
    lastDonationDaysAgo: 30
  },
  {
    name: 'Tasnim Akter',
    email: 'tasnim.akter@gmail.com',
    gender: 'female',
    avatarN: 47,
    bloodGroup: 'O+',
    district: 'Rajshahi',
    upazila: 'Rajshahi Sadar',
    height: 158,
    weight: 52,
    donationCount: 6,
    urgentDonations: 2,
    campRegistrations: 1,
    attendedCamps: 1,
    lastDonationDaysAgo: 120
  },
  {
    name: 'Arif Hossain',
    email: 'arif.hossain@gmail.com',
    gender: 'male',
    avatarN: 51,
    bloodGroup: 'AB+',
    district: 'Khulna',
    upazila: 'Khulna Sadar',
    height: 170,
    weight: 65,
    donationCount: 5,
    urgentDonations: 1,
    campRegistrations: 1,
    attendedCamps: 0,
    lastDonationDaysAgo: 60
  },
  {
    name: 'Farzana Yasmin',
    email: 'farzana.yasmin@gmail.com',
    gender: 'female',
    avatarN: 57,
    bloodGroup: 'B-',
    district: 'Barisal',
    upazila: 'Barisal Sadar',
    height: 159,
    weight: 53,
    donationCount: 3,
    urgentDonations: 1,
    campRegistrations: 0,
    attendedCamps: 0,
    lastDonationDaysAgo: 10
  },
  {
    name: 'Rakibul Hasan',
    email: 'rakibul.hasan@gmail.com',
    gender: 'male',
    avatarN: 68,
    bloodGroup: 'A-',
    district: 'Rangpur',
    upazila: 'Rangpur Sadar',
    height: 174,
    weight: 70,
    donationCount: 3,
    urgentDonations: 0,
    campRegistrations: 1,
    attendedCamps: 1,
    lastDonationDaysAgo: 150
  },
  {
    name: 'Sumaiya Islam',
    email: 'sumaiya.islam@gmail.com',
    gender: 'female',
    avatarN: 65,
    bloodGroup: 'AB-',
    district: 'Gazipur',
    upazila: 'Gazipur Sadar',
    height: 157,
    weight: 51,
    donationCount: 1,
    urgentDonations: 1,
    campRegistrations: 0,
    attendedCamps: 0,
    lastDonationDaysAgo: 20
  },
  {
    name: 'Mehedi Hasan',
    email: 'mehedi.hasan@gmail.com',
    gender: 'male',
    avatarN: 75,
    bloodGroup: 'O+',
    district: 'Cumilla',
    upazila: 'Cumilla Sadar',
    height: 169,
    weight: 63,
    donationCount: 1,
    urgentDonations: 0,
    campRegistrations: 1,
    attendedCamps: 0,
    lastDonationDaysAgo: 180
  },
  {
    name: 'Sadia Afrin',
    email: 'sadia.afrin@gmail.com',
    gender: 'female',
    avatarN: 72,
    bloodGroup: 'B+',
    district: 'Mymensingh',
    upazila: 'Mymensingh Sadar',
    height: 161,
    weight: 54,
    donationCount: 0,
    urgentDonations: 0,
    campRegistrations: 1,
    attendedCamps: 0,
    lastDonationDaysAgo: null
  },
  {
    name: 'Sabbir Rahman',
    email: 'sabbir.rahman@gmail.com',
    gender: 'male',
    avatarN: 83,
    bloodGroup: 'A+',
    district: 'Narayanganj',
    upazila: 'Narayanganj Sadar',
    height: 171,
    weight: 66,
    donationCount: 0,
    urgentDonations: 0,
    campRegistrations: 0,
    attendedCamps: 0,
    lastDonationDaysAgo: null
  },
  {
    name: 'Jannatul Ferdous',
    email: 'jannatul.ferdous@gmail.com',
    gender: 'female',
    avatarN: 86,
    bloodGroup: 'O-',
    district: 'Feni',
    upazila: 'Feni Sadar',
    height: 162,
    weight: 55,
    donationCount: 0,
    urgentDonations: 0,
    campRegistrations: 0,
    attendedCamps: 0,
    lastDonationDaysAgo: null
  },
  {
    name: 'Nayeem Islam',
    email: 'nayeem.islam@gmail.com',
    gender: 'male',
    avatarN: 91,
    bloodGroup: 'B+',
    district: 'Tangail',
    upazila: 'Tangail Sadar',
    height: 173,
    weight: 67,
    donationCount: 0,
    urgentDonations: 0,
    campRegistrations: 0,
    attendedCamps: 0,
    lastDonationDaysAgo: null
  },
  {
    name: 'Tania Sultana',
    email: 'tania.sultana@gmail.com',
    gender: 'female',
    avatarN: 90,
    bloodGroup: 'A-',
    district: 'Jashore',
    upazila: 'Jashore Sadar',
    height: 158,
    weight: 52,
    donationCount: 0,
    urgentDonations: 0,
    campRegistrations: 0,
    attendedCamps: 0,
    lastDonationDaysAgo: null
  },
  {
    name: 'Fahim Chowdhury',
    email: 'fahim.chowdhury@gmail.com',
    gender: 'male',
    avatarN: 96,
    bloodGroup: 'AB+',
    district: 'Bogura',
    upazila: 'Bogura Sadar',
    height: 176,
    weight: 71,
    donationCount: 0,
    urgentDonations: 0,
    campRegistrations: 0,
    attendedCamps: 0,
    lastDonationDaysAgo: null
  }
];

const buildUsers = () => {
  const users = donorSeed.map((d) => {
    const donationCount = d.donationCount;
    const points =
      10 +
      donationCount * 30 +
      d.urgentDonations * 20 +
      d.campRegistrations * 5 +
      d.attendedCamps * 15;

    return {
      name: d.name,
      email: d.email,
      avatar: avatar(d.gender, d.avatarN),
      role: 'donor',
      bloodGroup: d.bloodGroup,
      district: d.district,
      upazila: d.upazila,
      status: 'active',
      height: d.height,
      weight: d.weight,
      age: d.age || null,
      institution: d.institution || '',
      lastDonationDate: d.lastDonationDaysAgo === null ? null : daysFromNow(-d.lastDonationDaysAgo),
      donationCount,
      points,
      badges: computeBadges(donationCount)
    };
  });

  users.push({
    name: 'Rahat Chowdhury',
    email: 'volunteer.bloodbridge@gmail.com',
    avatar: avatar('male', 12),
    role: 'volunteer',
    bloodGroup: 'B+',
    district: 'Dhaka',
    upazila: 'Dhaka Sadar',
    status: 'active',
    height: 170,
    weight: 64,
    lastDonationDate: daysFromNow(-100),
    donationCount: 2,
    points: 10 + 2 * 30 + 5 + 15,
    badges: computeBadges(2)
  });

  users.push({
    name: 'Admin',
    email: 'admin.bloodbridge@gmail.com',
    avatar: avatar('male', 15),
    role: 'admin',
    bloodGroup: 'O+',
    district: 'Dhaka',
    upazila: 'Dhaka Sadar',
    status: 'active',
    height: null,
    weight: null,
    lastDonationDate: null,
    donationCount: 0,
    points: 10,
    badges: []
  });

  return users;
};

const requestSeed = [
  {
    requesterName: 'Nayeem Islam',
    requesterEmail: 'nayeem.islam@gmail.com',
    recipientName: 'Shahidul Islam',
    bloodGroup: 'B+',
    hospitalName: HOSPITALS[0],
    fullAddress: 'Ward 9, Dhaka Medical College Hospital, Shahbagh',
    district: 'Dhaka',
    upazila: 'Dhaka Sadar',
    donationDate: daysFromNow(3),
    donationTime: '10:30',
    requestMessage: 'My father needs B+ blood for surgery. Please help urgently.',
    urgent: true,
    status: 'pending'
  },
  {
    requesterName: 'Tania Sultana',
    requesterEmail: 'tania.sultana@gmail.com',
    recipientName: 'Rina Begum',
    bloodGroup: 'A-',
    hospitalName: HOSPITALS[2],
    fullAddress: 'Unit 4, Evercare Hospital, Plot 81, Block E, Bashundhara',
    district: 'Dhaka',
    upazila: 'Dhaka Sadar',
    donationDate: daysFromNow(1),
    donationTime: '09:00',
    requestMessage: 'Emergency A- needed for thalassemia patient.',
    urgent: true,
    status: 'pending'
  },
  {
    requesterName: 'Sabbir Rahman',
    requesterEmail: 'sabbir.rahman@gmail.com',
    recipientName: 'Abdur Rob',
    bloodGroup: 'O+',
    hospitalName: HOSPITALS[3],
    fullAddress: 'Square Hospital, Panthapath, Dhanmondi',
    district: 'Dhaka',
    upazila: 'Dhaka Sadar',
    donationDate: daysFromNow(5),
    donationTime: '14:00',
    requestMessage: 'O+ blood required for kidney patient.',
    urgent: false,
    status: 'pending'
  },
  {
    requesterName: 'Jannatul Ferdous',
    requesterEmail: 'jannatul.ferdous@gmail.com',
    recipientName: 'Karim Mia',
    bloodGroup: 'AB+',
    hospitalName: HOSPITALS[5],
    fullAddress: 'Chattogram Medical College Hospital, 57 K.B. Fazlul Kader Road',
    district: 'Chattogram',
    upazila: 'Chattogram Sadar',
    donationDate: daysFromNow(7),
    donationTime: '11:00',
    requestMessage: '',
    urgent: false,
    status: 'pending'
  },
  {
    requesterName: 'Fahim Chowdhury',
    requesterEmail: 'fahim.chowdhury@gmail.com',
    recipientName: 'Mokbul Hossain',
    bloodGroup: 'B-',
    hospitalName: HOSPITALS[6],
    fullAddress: 'Osmani Medical College, Tilagor, Sylhet',
    district: 'Sylhet',
    upazila: 'Sylhet Sadar',
    donationDate: daysFromNow(10),
    donationTime: '15:30',
    requestMessage: 'B- blood needed, rare group please help.',
    urgent: true,
    status: 'pending'
  },
  {
    requesterName: 'Rup',
    requesterEmail: 'rup.ahmed@gmail.com',
    recipientName: 'Ayesha Akter',
    bloodGroup: 'A+',
    hospitalName: HOSPITALS[1],
    fullAddress: 'BSMMU, Shahbagh, Dhaka',
    district: 'Dhaka',
    upazila: 'Dhaka Sadar',
    donationDate: daysFromNow(-1),
    donationTime: '12:00',
    requestMessage: 'My sister is recovering and needs A+ for a follow-up transfusion.',
    urgent: false,
    status: 'inprogress',
    donorInfo: { name: 'Tanvir Ahmed', email: 'tanvir.ahmed@gmail.com' }
  },
  {
    requesterName: 'Nusrat Jahan',
    requesterEmail: 'nusrat.jahan@gmail.com',
    recipientName: 'Abdul Gofur',
    bloodGroup: 'B+',
    hospitalName: HOSPITALS[4],
    fullAddress: 'Apollo Hospitals, Plot 81, Block E, Bashundhara R/A',
    district: 'Dhaka',
    upazila: 'Dhaka Sadar',
    donationDate: daysFromNow(-2),
    donationTime: '10:00',
    requestMessage: 'B+ plasma needed for dengue patient.',
    urgent: true,
    status: 'inprogress',
    donorInfo: { name: 'Sabbir Rahman', email: 'sabbir.rahman@gmail.com' }
  },
  {
    requesterName: 'Rakibul Hasan',
    requesterEmail: 'rakibul.hasan@gmail.com',
    recipientName: 'Mofazzal Hossain',
    bloodGroup: 'O+',
    hospitalName: HOSPITALS[10],
    fullAddress: 'Rangpur Medical College Hospital, Alamnagar',
    district: 'Rangpur',
    upazila: 'Rangpur Sadar',
    donationDate: daysFromNow(-30),
    donationTime: '11:30',
    requestMessage: 'O+ donated for accident victim. Thank you donors!',
    urgent: false,
    status: 'done',
    donorInfo: { name: 'Rup', email: 'rup.ahmed@gmail.com' }
  },
  {
    requesterName: 'Arif Hossain',
    requesterEmail: 'arif.hossain@gmail.com',
    recipientName: 'Josna Khatun',
    bloodGroup: 'AB+',
    hospitalName: HOSPITALS[8],
    fullAddress: 'Khulna Medical College Hospital, Khulna',
    district: 'Khulna',
    upazila: 'Khulna Sadar',
    donationDate: daysFromNow(-45),
    donationTime: '09:30',
    requestMessage: '',
    urgent: true,
    status: 'done',
    donorInfo: { name: 'Nusrat Jahan', email: 'nusrat.jahan@gmail.com' }
  },
  {
    requesterName: 'Farzana Yasmin',
    requesterEmail: 'farzana.yasmin@gmail.com',
    recipientName: 'Halima Bibi',
    bloodGroup: 'B-',
    hospitalName: HOSPITALS[9],
    fullAddress: 'Barisal General Hospital, Sadar Road',
    district: 'Barisal',
    upazila: 'Barisal Sadar',
    donationDate: daysFromNow(-60),
    donationTime: '16:00',
    requestMessage: 'B- donated for a new mother. Thanks everyone!',
    urgent: false,
    status: 'done',
    donorInfo: { name: 'Tanvir Ahmed', email: 'tanvir.ahmed@gmail.com' }
  },
  {
    requesterName: 'Mehedi Hasan',
    requesterEmail: 'mehedi.hasan@gmail.com',
    recipientName: 'Delwar Hossain',
    bloodGroup: 'A+',
    hospitalName: HOSPITALS[7],
    fullAddress: 'Rajshahi Medical College Hospital, Shahmakhdum',
    district: 'Rajshahi',
    upazila: 'Rajshahi Sadar',
    donationDate: daysFromNow(-90),
    donationTime: '13:00',
    requestMessage: 'A+ donated for heart surgery patient.',
    urgent: false,
    status: 'done',
    donorInfo: { name: 'Arif Hossain', email: 'arif.hossain@gmail.com' }
  },
  {
    requesterName: 'Sadia Afrin',
    requesterEmail: 'sadia.afrin@gmail.com',
    recipientName: 'Amirul Islam',
    bloodGroup: 'O-',
    hospitalName: HOSPITALS[11],
    fullAddress: 'Kumudini Hospital, Mirzapur',
    district: 'Tangail',
    upazila: 'Mirzapur',
    donationDate: daysFromNow(-15),
    donationTime: '10:00',
    requestMessage: 'Requirement withdrawn, patient recovered. Canceled.',
    urgent: false,
    status: 'canceled'
  }
];

const CAMP_SEED = [
  {
    title: 'Central Dhaka Blood Donation Camp 2026',
    description: 'A community blood donation camp organized to meet the emergency demand of Dhaka city hospitals. Donors get points and a certificate.',
    thumbnail: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1200',
    organizerName: 'Rahat Chowdhury',
    organizerEmail: 'volunteer.bloodbridge@gmail.com',
    district: 'Dhaka',
    upazila: 'Savar',
    fullAddress: 'National Memorial Hall, Savar, Dhaka',
    campDate: daysFromNow(10),
    startTime: '09:00',
    endTime: '17:00',
    bloodTarget: 80,
    status: 'upcoming'
  },
  {
    title: 'Chattogram Coastal Blood Camp',
    description: 'Coastal blood donation drive with Chattogram Medical College Hospital.',
    thumbnail: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=1200',
    organizerName: 'Rahat Chowdhury',
    organizerEmail: 'volunteer.bloodbridge@gmail.com',
    district: 'Chattogram',
    upazila: 'Chattogram Sadar',
    fullAddress: 'Chattogram Medical College Auditorium',
    campDate: daysFromNow(25),
    startTime: '09:30',
    endTime: '16:30',
    bloodTarget: 60,
    status: 'upcoming'
  },
  {
    title: 'Rajshahi University Blood Donation Drive',
    description: 'University-wide donation camp in collaboration with Rajshahi Medical College.',
    thumbnail: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1200',
    organizerName: 'Rahat Chowdhury',
    organizerEmail: 'volunteer.bloodbridge@gmail.com',
    district: 'Rajshahi',
    upazila: 'Rajshahi Sadar',
    fullAddress: 'Rajshahi University Central Auditorium',
    campDate: daysFromNow(0),
    startTime: '10:00',
    endTime: '18:00',
    bloodTarget: 50,
    status: 'ongoing'
  },
  {
    title: 'Sylhet Tea Garden Blood Camp',
    description: 'Blood donation camp for the tea garden community of Sylhet.',
    thumbnail: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1200',
    organizerName: 'Rahat Chowdhury',
    organizerEmail: 'volunteer.bloodbridge@gmail.com',
    district: 'Sylhet',
    upazila: 'Sylhet Sadar',
    fullAddress: 'Sylhet MAG Osmani Medical College',
    campDate: daysFromNow(-30),
    startTime: '09:00',
    endTime: '17:00',
    bloodTarget: 70,
    status: 'completed'
  },
  {
    title: 'Khulna Divisional Blood Donation Camp',
    description: 'Completed camp for Khulna Medical College Hospital patients.',
    thumbnail: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200',
    organizerName: 'Rahat Chowdhury',
    organizerEmail: 'volunteer.bloodbridge@gmail.com',
    district: 'Khulna',
    upazila: 'Khulna Sadar',
    fullAddress: 'Khulna Medical College Hospital premises',
    campDate: daysFromNow(-60),
    startTime: '09:30',
    endTime: '16:00',
    bloodTarget: 50,
    status: 'completed'
  },
  {
    title: 'Barisal Emergency Blood Drive',
    description: 'Canceled due to cyclone warning.',
    thumbnail: '',
    organizerName: 'Rahat Chowdhury',
    organizerEmail: 'volunteer.bloodbridge@gmail.com',
    district: 'Barisal',
    upazila: 'Barisal Sadar',
    fullAddress: 'Barisal City Corporation Hall',
    campDate: daysFromNow(-5),
    startTime: '10:00',
    endTime: '17:00',
    bloodTarget: 40,
    status: 'canceled'
  }
];

const BLOG_SEED = [
  {
    title: 'Why Blood Donation Matters in Bangladesh',
    thumbnail: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=1200',
    content:
      '<p>Every year Bangladesh needs around <strong>9 lakh bags of blood</strong>, but most of it is collected from replacement donors.</p><p>Being a regular voluntary donor is the safest and most reliable way to keep our blood banks full.</p><p>One donation can save up to <strong>three lives</strong>. Make it a habit to donate every 90 days.</p>',
    status: 'published',
    authorName: 'Rahat Chowdhury',
    authorEmail: 'volunteer.bloodbridge@gmail.com'
  },
  {
    title: 'Understanding Your Blood Type: A+ to O-',
    thumbnail: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1200',
    content:
      '<p>Blood types are determined by antigens on the surface of red blood cells.</p><p>O- is the <strong>universal donor</strong> and can give to anyone, while AB+ is the <strong>universal recipient</strong> and can receive from anyone.</p><p>Knowing your blood group helps you and others during emergencies.</p>',
    status: 'published',
    authorName: 'Rup',
    authorEmail: 'rup.ahmed@gmail.com'
  },
  {
    title: 'The 90-Day Rule: Why You Should Wait Between Donations',
    thumbnail: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200',
    content:
      '<p>Your body needs time to regenerate red blood cells after donating.</p><p>The recommended gap between whole blood donations is <strong>90 days</strong> for men and <strong>120 days</strong> for women.</p><p>Donating too frequently can cause iron deficiency and dizziness.</p>',
    status: 'published',
    authorName: 'Rahat Chowdhury',
    authorEmail: 'volunteer.bloodbridge@gmail.com'
  },
  {
    title: 'How to Prepare for a Blood Donation Day',
    thumbnail: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=1200',
    content:
      '<p>Drink plenty of water the day before, eat iron-rich food, and sleep well.</p><p>Avoid fatty meals right before donating, and never donate on an empty stomach.</p><p>After donating, rest for 15 minutes and have a light snack.</p>',
    status: 'published',
    authorName: 'Nusrat Jahan',
    authorEmail: 'nusrat.jahan@gmail.com'
  },
  {
    title: 'Draft: Community Blood Donor Recognition Program',
    thumbnail: '',
    content:
      '<p>Draft plan for recognizing top voluntary donors across districts.</p>',
    status: 'draft',
    authorName: 'Rahat Chowdhury',
    authorEmail: 'volunteer.bloodbridge@gmail.com'
  }
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB\n');

  const models = [
    { name: 'User', model: User },
    { name: 'DonationRequest', model: DonationRequest },
    { name: 'DonationRecord', model: DonationRecord },
    { name: 'DonationCamp', model: DonationCamp },
    { name: 'CampRegistration', model: CampRegistration },
    { name: 'Blog', model: Blog }
  ];

  const force = process.argv.includes('--force');

  if (!force) {
    for (const { name, model } of models) {
      const count = await model.countDocuments();
      if (count > 0) {
        console.error(
          `Collection "${name}" already has ${count} document(s).\n` +
          'Run with --force to wipe all collections and re-seed:\n' +
          '  npm run seed -- --force'
        );
        await mongoose.disconnect();
        process.exit(1);
      }
    }
  } else {
    for (const { name, model } of models) {
      await model.deleteMany({});
      console.log(`Cleared collection: ${name}`);
    }
  }

  const users = buildUsers();
  const savedUsers = await User.insertMany(users);
  console.log(`Seeded ${savedUsers.length} users (incl. "Rup" as top donor)`);

  const requests = requestSeed.map((r) => ({ ...r }));
  const savedRequests = await DonationRequest.insertMany(requests);
  console.log(`Seeded ${savedRequests.length} donation requests`);

  const records = savedRequests
    .filter((r) => r.status === 'done' && r.donorInfo && r.donorInfo.email)
    .map((r) => ({
      donorName: r.donorInfo.name,
      donorEmail: r.donorInfo.email,
      recipientName: r.recipientName,
      bloodGroup: r.bloodGroup,
      hospitalName: r.hospitalName,
      district: r.district,
      donationDate: r.donationDate,
      requestId: r._id,
      certificateId: `BB-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      wasUrgent: r.urgent
    }));
  const savedRecords = await DonationRecord.insertMany(records);
  console.log(`Seeded ${savedRecords.length} donation records`);

  const camps = await DonationCamp.insertMany(CAMP_SEED);
  console.log(`Seeded ${camps.length} donation camps`);

  const campRegistrations = [];
  const donorPool = savedUsers.filter((u) => u.role === 'donor');
  const assign = (camp, donorIdx, attended) => {
    const donor = donorPool[donorIdx];
    campRegistrations.push({
      campId: camp._id,
      donorName: donor.name,
      donorEmail: donor.email,
      bloodGroup: donor.bloodGroup,
      status: 'confirmed',
      attended
    });
  };

  assign(camps[0], 0, false); // Rup -> Central Dhaka
  assign(camps[0], 1, false); // Nusrat
  assign(camps[0], 7, false); // Sumaiya
  assign(camps[1], 2, false); // Tanvir -> Chattogram
  assign(camps[2], 0, true);  // Rup -> Rajshahi (attended)
  assign(camps[2], 1, true);  // Nusrat (attended)
  assign(camps[2], 3, true);  // Tasnim (attended)
  assign(camps[2], 4, false); // Arif
  assign(camps[3], 2, true);  // Tanvir -> Sylhet (attended)
  assign(camps[3], 6, true);  // Rakibul (attended)
  assign(camps[3], 8, false); // Mehedi
  assign(camps[4], 5, false); // Farzana -> Khulna
  assign(camps[4], 9, false); // Sadia

  const savedRegs = await CampRegistration.insertMany(campRegistrations);
  console.log(`Seeded ${savedRegs.length} camp registrations`);

  const blogs = await Blog.insertMany(BLOG_SEED);
  console.log(`Seeded ${blogs.length} blogs`);

  console.log('\nSeed completed successfully!');
  console.log('Top donor on leaderboard: Rup (rup.ahmed@gmail.com)');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
