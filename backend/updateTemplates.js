const fs = require('fs');
const path = require('path');

const templatesPath = path.join(__dirname, '..', 'src', 'data', 'templates.json');
const rawData = fs.readFileSync(templatesPath, 'utf8');
const templates = JSON.parse(rawData);

// Helper to generate a realistic prompt based on the template metadata
function generatePrompt(t) {
  let subject = "a person";
  if (t.category === 'Wedding') subject = "a beautiful bride and handsome groom";
  else if (t.category === 'LinkedIn') subject = "a professional executive";
  else if (t.category === 'Royal') subject = "a majestic monarch";
  else if (t.category === 'Gaming') subject = "a fierce esports competitor";
  else if (t.category === 'Movie Posters') subject = "a cinematic hero";
  else if (t.category === 'Travel') subject = "an adventurous traveler";

  let prompt = `Highly detailed, photorealistic masterpiece of ${subject} in the style of '${t.title}'. `;
  prompt += `Atmosphere: ${t.description} `;
  
  if (t.tags && t.tags.length > 0) {
    prompt += `Visual tags: ${t.tags.join(', ')}. `;
  }
  
  prompt += `Shot on 35mm lens, cinematic lighting, 8k resolution, highly detailed faces, intricate textures.`;
  return prompt;
}

templates.forEach(t => {
  // If it's a wedding template, it requires 2 photos (e.g., bride & groom)
  t.requiredPhotos = t.category === 'Wedding' ? 2 : 1;
  t.basePrompt = generatePrompt(t);
});

fs.writeFileSync(templatesPath, JSON.stringify(templates, null, 2), 'utf8');
console.log(`Updated ${templates.length} templates successfully!`);
