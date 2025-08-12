# 📧 Email Setup Guide - Get Real Email Notifications

To receive actual emails when customers submit orders, you need to set up EmailJS. Follow these steps:

## Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Add Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" (recommended for gamingspider0005@gmail.com)
4. Follow the setup to connect your Gmail account
5. **Copy the Service ID** (looks like: service_xxxxxxx)

## Step 3: Create Email Template
1. Go to "Email Templates" in EmailJS dashboard
2. Click "Create New Template"
3. Use this template content:

**Subject:**
```
New Project Request - {{project_type}} from {{from_name}}
```

**Body:**
```
New Project Request Details:

Customer Information:
- Name: {{from_name}}
- Email: {{from_email}}
- Phone: {{phone}}

Project Details:
- Type: {{project_type}}
- Budget Range: {{budget_range}}
- Timeline: {{timeline}}
- Estimated Price: {{estimated_price}}

Project Description:
{{project_description}}

Submitted: {{submitted_time}}

Please respond to the customer within 24 hours.
Reply to: {{reply_to}}
```

4. Set "To Email" to: `gamingspider0005@gmail.com`
5. Save the template and **copy the Template ID** (looks like: template_xxxxxxx)

## Step 4: Get Public Key
1. Go to "Account" section in EmailJS dashboard
2. Find your **Public Key** (looks like: a long string of characters)

## Step 5: Update Your Website Code
Open `script.js` and replace these values in the `EMAILJS_CONFIG` object:

```javascript
const EMAILJS_CONFIG = {
    serviceID: 'service_xxxxxxx', // Replace with your Service ID
    templateID: 'template_xxxxxxx', // Replace with your Template ID
    publicKey: 'your_public_key_here' // Replace with your Public Key
};
```

## Step 6: Test the Setup
1. Open your website
2. Fill out the project request form
3. Submit it
4. Check your Gmail inbox for the notification email

## 🎉 You're Done!
Now you'll receive actual emails at `gamingspider0005@gmail.com` every time someone submits a project request!

## Troubleshooting
- **No emails received**: Check spam folder, verify EmailJS setup
- **EmailJS errors**: Check browser console for error messages
- **Gmail not working**: Try using a different email service in EmailJS

## Free Plan Limits
- EmailJS free plan: 200 emails/month
- Perfect for starting your freelance business
- Upgrade available if you need more

---
**Need Help?** Check the browser console for error messages or contact EmailJS support. 