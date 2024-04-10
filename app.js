const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 80; 
const db = require('./static/models/database.js');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));
app.set('view engine', 'ejs');



app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await db.users.findOne({ where: { email, password } });
  
    if (user) {
      res.redirect('/admin');
    } else {
      res.send('Failed to authenticate');
    }
  });

app.post('/update-info', async (req, res) => {
  const { position, disponibilite, synopsis, email, number, website } = req.body;

  try {
    const infoToUpdate = await db.info.findOne();
    
    if (infoToUpdate) {
      // Update the existing record
      await infoToUpdate.update({
        position: position,
        disponibilite: disponibilite,
        synopsis: synopsis,
        email: email,
        number: number,
        website: website
      });
      
      res.redirect('/admin'); // Redirect back to the admin page
    } else {
      res.status(404).send('Info not found');
    }
  } catch (error) {
    console.error('Error updating info:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/update-education', async (req, res) => {
  const { updatedEducation, newEducation } = req.body;

  try {
    if (updatedEducation && Array.isArray(updatedEducation)) {
      for (const edu of updatedEducation) {
        
        const { id, title, description } = edu;
        const educationToUpdate = await db.education.findByPk(id);
        if (educationToUpdate) {
          // Update the existing record
          await educationToUpdate.update({ education_title: title, education_description: description });
          console.log("updated to the database");
        }
      }
    }

    if (newEducation) {
      // title and description should always have the same length
      for (let index = 1; index<newEducation.title.length; index++) {
        console.log("added to the database");
        await db.education.create({ education_title: newEducation.title[index], education_description: newEducation.description[index] });
      }
    }

    res.redirect('/admin');
  } catch (error) {
    console.error('Error updating education:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/update-experience', async (req, res) => {
  const { updatedExperience, newExperience } = req.body;
  console.log(req.body);
  try {
    if (updatedExperience && Array.isArray(updatedExperience)) {
      for (const exp of updatedExperience) {
        
        const { id, title, location, description } = exp;
        const experienceToUpdate = await db.experience.findByPk(id);
        if (experienceToUpdate) {
          // Update the existing record
          await experienceToUpdate.update({ title: title, location: location, description: description });
          console.log("updated to the database");
        }
      }
    }

    if (newExperience) {
      // title, location and description should always have the same length
      for (let index = 1; index<newExperience.title.length; index++) {
        console.log("added to the database");
        await db.experience.create({ title: newExperience.title[index], location: newExperience.location[index], description: newExperience.description[index] });
      }
    }

    res.redirect('/admin');
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/update-certificates', async (req, res) => {
  const { updatedCertificate, newCertificate } = req.body;
  console.log(req.body);
  try {
    if (updatedCertificate && Array.isArray(updatedCertificate)) {
      for (const certi of updatedCertificate) {
        
        const { id, title, description } = certi;
        const certificatesToUpdate = await db.certificates.findByPk(id);
        if (certificatesToUpdate) {
          // Update the existing record
          await certificatesToUpdate.update({ certificates_title: title, certificates_description: description });
          console.log("updated to the database");
        }
      }
    }

    if (newCertificate) {
      // title and description should always have the same length
      for (let index = 1; index<newCertificate.title.length; index++) {
        console.log("added to the database");
        await db.certificates.create({ certificates_title: newCertificate.title[index], certificates_description: newCertificate.description[index] });
      }
    }

    res.redirect('/admin');
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/update-interest', async (req, res) => {
  const { updatedInterest, newInterest } = req.body;
  console.log(req.body);
  try {
    if (updatedInterest && Array.isArray(updatedInterest)) {
      for (const inter of updatedInterest) {
        
        const { id, name } = inter;
        const interestToUpdate = await db.interest.findByPk(id);
        if (interestToUpdate) {
          // Update the existing record
          await interestToUpdate.update({ interest_name: name });
          console.log("updated to the database");
        }
      }
    }

    if (newInterest) {
      for (let index = 1; index<newInterest.name.length; index++) {
        console.log("added to the database");
        await db.interest.create({ interest_name: newInterest.name[index] });
      }
    }

  
    res.redirect('/admin');
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/update-skills', async (req, res) => {
  const { updatedSkills, newSkill } = req.body;
  console.log(req.body);
  try {
    if (updatedSkills && Array.isArray(updatedSkills)) {
      for (const skill of updatedSkills) {
        
        const { id, name, level } = skill;
        const skillsToUpdate = await db.skills.findByPk(id);
        if (skillsToUpdate) {
          // Update the existing record
          await skillsToUpdate.update({ skills_name: name, skill_level: level });
          console.log("updated to the database");
        }
      }
    }

    if (newSkill) {
      for (let index = 1; index<newSkill.name.length; index++) {
        console.log("added to the database");
        await db.skills.create({ skills_name: newSkill.name[index], skill_level: newSkill.level[index] });
      }
    }

  
    res.redirect('/admin');
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).send('Internal Server Error');
  }
});


  app.get('/', async (req, res) => {
    try {
      // Récupération des données de la base de données
      const info = await db.info.findAll();
      const experience = await db.experience.findAll({ order : [['id', 'DESC']] });
      const expertise = await db.expertise.findAll();
      const interest = await db.interest.findAll();
      const certificates = await db.certificates.findAll();
      const skills = await db.skills.findAll({ order : [['skill_level', 'DESC']]});
      const education = await db.education.findAll({ order : [['id', 'DESC']] });
  
      // Rendu de la page en utilisant les données récupérées
      res.render('index.ejs', { info, experience, expertise, interest, skills, certificates, education});
    } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal Server Error');
    }
  });


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'))
})


app.get('/admin', async (req, res) => {
  try {
    // Récupération des données de la base de données
    const info = await db.info.findAll();
    const experience = await db.experience.findAll();
    const expertise = await db.expertise.findAll();
    const interest = await db.interest.findAll();
    const certificates = await db.certificates.findAll();
    const skills = await db.skills.findAll();
    const education = await db.education.findAll();

    // Render the admin page with the fetched data
    res.render('admin.ejs', { info, experience, expertise, interest, skills, certificates, education });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

db.sequelize.sync().then(() => {
  app.listen(80, () => console.log('Server running on port 80'));
});


/*
Création de la base de donnée initiale

const cheerio = require('cheerio');
const fs = require('fs');

// read the HTML file
const htmlContent = fs.readFileSync(path.join(__dirname, 'templates', 'index.html'), 'utf8');

// use cheerio to load the HTML and parse it
const $ = cheerio.load(htmlContent);

// Table info (db.info)
const position = $('.position').text();
const disponibilite = $('.disponibilite').text();
const synopsis = $('.synopsis').text().trim();
const email = $('.email').text().trim();
const number = $('.number').text();
const website = $('a.website').attr('href');

// Table experience (db.experience)
const experienceData = [];
$('.XP').each((i, elem) => {
  const title = $(elem).find('h3').text().trim();
  const location = $(elem).find('h4').text().trim();
  const description = $(elem).find('p').text().trim();

  experienceData.push({ title, location, description });
});

// Table expertise (db.expertise)
const expertiseData = [];
$('li.expertise').each((i, elem) => {
  const expertise_name = $(elem).text().trim();
  expertiseData.push({expertise_name});
});

// Table interest (db.interest)
const interestData = []
$('li.interet').each((i, elem) => {
  const interest_name = $(elem).text().trim();
  interestData.push({interest_name});
});

// Table skills (db.skills)
const skillsData = [];
$('.skill-name').each((i, skillNameElement) => {
  const skills_name = $(skillNameElement).text().trim().replace(':', '');
  // Comptez les étoiles "checked" pour la compétence actuelle
  let skill_level = 0;
  $(skillNameElement).nextUntil('h3').each((j, starElement) => {
    if ($(starElement).hasClass('fa-star') && $(starElement).hasClass('checked')) {
      skill_level++;
    }
  });

  skillsData.push({skills_name, skill_level});
});

// Table certificates (db.certificates)
const certificatesData = [];
$('.certif').each((i, elem) => {
  const certificates_title = $(elem).find('.certificates-title').text().trim();
  const certificates_description = $(elem).find('.certificates-desc').text().trim();

  certificatesData.push({certificates_title , certificates_description});
});

async function storeCVData() {
  try {
    // ajout des infos
    await db.info.create({ position, disponibilite, synopsis, email, number, website });

    // ajout des experiences
    for (const data of experienceData) {
      await db.experience.create(data);
    }

    // ajout des expertises
    for (const data of expertiseData) {
      await db.expertise.create(data);
    }
    
    // ajout des interest
    for (const data of interestData) {
      await db.interest.create(data);
    }

    // ajout des skills
    for (const skill of skillsData) {
      await db.skills.create(skill);
    }

    // ajout des certificates
    for (const certificate of certificatesData) {
      await db.certificates.create(certificate);
    }

    // ... do the same for the other parts of the CV
    console.log("Data stored successfully");
  } catch (error) {
    console.error("Error storing CV data:", error);
  }
}


async function addUser(email, password) {
  try {
    const newUser = await db.users.create({
      email,
      password
      
    });
    console.log("User added successfully:", newUser.get({ plain: true }));
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

async function insertEducationData() {
  try {
    // Entry 1
    await db.education.create({
      education_title: 'Esiroi / 2021 - Current',
      education_description: 'First year engineering student specializing in IT'
    });

    // Entry 2
    await db.education.create({
      education_title: 'Lycée Lislet Geoffroy / 2017-2020',
      education_description: 'BAC-S in engineering science with ISN option (computer science, digital science)'
    });

    console.log('Education data inserted successfully.');
  } catch (error) {
    console.error('Error inserting education data:', error);
  }
}

/*
async function insertinfo() {
  try {
    await db.info.create({
      email: 'raphael.soupayavalliama@gmail.com',
      number: '0693879048',
      website: 'https://esiroi.univ-reunion.fr'
    });
    
    console.log("info data added");
  } catch (error) {
    console.error("Error adding data:",  error);
  }
}
*/

/*
addUser("raphael.soupayavalliama@gmail.com", "bougfaible974");
addUser("andy.martel@univ-reunion.fr", "imzeboss974");
storeCVData();
insertEducationData();*/

//insertinfo();