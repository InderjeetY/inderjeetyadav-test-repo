/*
This file contains the EmailJS logic.
It's loaded into index.html and called by chat.js
*/
function sendEmail(name, jobTitle, email, phone, jobDescription) {
    // --- PASTE YOUR 3 KEYS FROM EMAILJS HERE ---
    const serviceID = 'service_6rm3z6r';
    const templateID = 'template_c7tlzk7';
    const publicKey = 'Q3KN7sLjEOmrAl7h6';
    // ------------------------------------------

    // This object's keys MUST match the variables in your EmailJS template
    const templateParams = {
        user_name: name,
        user_job_title: jobTitle, // The new field
        user_email: email,
        user_phone: phone,
        job_description: jobDescription
    };

    // Send the email
    emailjs.send(serviceID, templateID, templateParams, publicKey)
        .then(function(response) {
            console.log('EmailJS: SUCCESS!', response.status, response.text);
        }, function(error) {
            console.log('EmailJS: FAILED...', error);
        });
}
