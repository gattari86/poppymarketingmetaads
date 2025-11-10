# Meta App Review - Screencast Script

This is the script for recording a 5-7 minute walkthrough of the Poppy Marketing Ads Manager application for Meta App Review submission.

## Preparation

**Equipment Needed:**
- Computer with screen recording software (QuickTime, ScreenFlow, or OBS)
- Microphone for narration
- Test Meta Business account with at least one ad account

**Recording Settings:**
- Resolution: 1920x1080 (Full HD)
- Frame rate: 30 fps
- Audio: Clear microphone, 44.1 kHz
- Format: MP4

**Pre-Recording Checklist:**
- [ ] Environment is quiet
- [ ] Test account is ready
- [ ] Browser is at full screen
- [ ] All tabs are closed except the app
- [ ] Read script 2-3 times to sound natural

---

## Screencast Script

### [0:00-0:30] Introduction

> "Hello, I'm demonstrating the Poppy Marketing Ads Manager application. This platform makes it easy for Meta Business users to create and manage advertising campaigns, ad sets, and ads through a single, intuitive dashboard.
>
> Let me walk you through the key features."

*Camera: Show home page or login screen*

---

### [0:30-1:30] Authentication & Account Selection

**Narrative:**
> "First, we'll authenticate using Facebook Login for Business. I'll click the 'Continue with Facebook Login for Business' button."

*Action:* Click the Facebook login button

*Narration (continue):*
> "This uses Meta's standard OAuth flow to securely authenticate the user. There are no passwords or credentials handled by our application."

*Wait for login/authorization*

*Narration (continue):*
> "After authorization, the user is taken to the dashboard where they can see all their available ad accounts. Each account displays its name, account ID, currency, and current status."

*Camera: Show dashboard with ad account list*

*Narration (continue):*
> "I can click on an account to select it. This selection is saved in the browser for quick access. The app now shows me all the campaigns associated with this account."

*Action:* Click an ad account to select it

---

### [1:30-3:00] Campaigns Management

**Narrative:**
> "Now let's look at campaign management. This account has several existing campaigns that are displayed in a clean list format."

*Camera: Show campaign list*

*Narration (continue):*
> "To create a new campaign, I'll click the 'Create Campaign' button."

*Action:* Click "+ Create Campaign" button

*Narration (continue):*
> "A modal appears with required fields: campaign name and campaign objective. The objective dropdown includes all major Meta campaign types like Link Clicks, Page Likes, Video Views, and Conversions."

*Action:* Fill in campaign details
- Name: "Summer Sale 2025"
- Objective: "LINK_CLICKS"

*Narration (continue):*
> "I'll enter a campaign name, select an objective, and click create. The API call happens on our server, keeping all sensitive operations secure."

*Action:* Click "Create Campaign" button

*Wait for success*

*Narration (continue):*
> "The new campaign appears immediately in the list. I can now expand any campaign to view and manage its ad sets."

---

### [3:00-4:15] Ad Sets Management

**Narrative:**
> "Let me click on a campaign to see its ad sets."

*Action:* Click on an existing campaign to expand

*Camera: Show ad sets section*

*Narration (continue):*
> "Each campaign shows its associated ad sets. I can add a new ad set by clicking the 'Add Ad Set' button."

*Action:* Click "+ Add Ad Set" button

*Narration (continue):*
> "The ad set creation form appears. I need to enter the ad set name and daily budget. The budget is entered in dollars and is automatically converted to the correct format for Meta's API."

*Action:* Fill in ad set details
- Name: "Summer Sale - US Desktop"
- Daily Budget: "100"

*Narration (continue):*
> "I can see the form has proper validation and helpful hints. After creating the ad set, it appears nested under the campaign, showing a clear hierarchy."

*Action:* Click "Create Ad Set" button

*Wait for success*

---

### [4:15-5:00] Ads Management

**Narrative:**
> "Under each ad set, I can view and create individual ads. Let me click on an ad set to expand it."

*Action:* Click on an ad set to expand

*Camera: Show ads list*

*Narration (continue):*
> "I can click 'Add Ad' to create a new ad. The ad creation form offers two options: I can either use an existing creative by providing a creative ID, or create a new creative with title, body text, and an image URL."

*Action:* Click "+ Add Ad" button

*Narration (continue):*
> "Let me select the option to create a new creative and fill in the details."

*Action:* Select "Create New Creative" option
*Action:* Fill in ad details:
- Name: "Summer Sale - Version A"
- Title: "Amazing Summer Deals!"
- Body: "Shop our collection with up to 50% off. Limited time only!"
- Image URL: [paste URL]

*Narration (continue):*
> "After filling in the ad details and clicking create, the ad is successfully created and now appears in the ads list for this ad set."

*Action:* Click "Create Ad" button

*Wait for success*

---

### [5:00-6:00] Automated Rules

**Narrative:**
> "One of the key features is automated rules. Let me navigate to the Rules section."

*Camera: Click on "Rules" in navigation*

*Narration (continue):*
> "Automated rules help you control ad spend. You can create rules that automatically pause ad sets when your daily spending exceeds a threshold."

*Action:* Click "+ Create Rule" button

*Narration (continue):*
> "I'll create a rule that pauses an ad set if we spend more than $500 in a single day. This helps prevent unexpected costs."

*Action:* Fill in rule details:
- Rule Name: "Daily Spend Cap - $500"
- Daily Spend Threshold: "500"
- Ad Set ID: [enter valid ID]

*Narration (continue):*
> "After creating the rule, it's immediately active. Meta's system will monitor the spending and automatically pause the ad set if the threshold is exceeded."

*Action:* Click "Create Rule" button

*Wait for success message*

---

### [6:00-6:45] Public Pages & Data Handling

**Narrative:**
> "The application also includes important legal and privacy pages accessible to all users."

*Action:* Scroll down to footer

*Narration (continue):*
> "In the footer, you'll see links to our Privacy Policy, Terms of Service, Data Deletion, and Support pages. These are critical for transparency and compliance."

*Action:* Click "Privacy Policy"

*Camera: Show privacy policy page*

*Narration (continue):*
> "Our Privacy Policy clearly outlines how we collect and handle user data. All personal information is protected, and we comply with GDPR and CCPA requirements."

*Action:* Go back

*Narration (continue):*
> "We also have a dedicated Data Deletion page where users can request their data be removed from our systems within 30 days."

*Action:* Navigate to Data Deletion page (if time permits)

---

### [6:45-7:00] Closing

**Narrative:**
> "That's the Poppy Marketing Ads Manager. The application provides a clean, intuitive interface for managing Meta advertising campaigns while maintaining the highest standards for data security and privacy.
>
> All API communication happens securely on the server, authentication is handled through Meta's OAuth, and user data is never shared with third parties.
>
> Thank you for considering this application for Meta's App Store."

*Camera: Return to dashboard*

---

## Recording Tips

1. **Speak Clearly:** Enunciate and speak at a steady pace
2. **Natural Pauses:** Allow time for loading screens and animations
3. **Point Out Details:** Use mouse cursor to highlight important elements
4. **Show Success:** Always wait for success messages to appear
5. **No Sensitive Info:** Don't show real business data if possible (use test accounts)
6. **Smooth Transitions:** Take time between sections for viewer comprehension
7. **Retakes:** If you make a mistake, restart that section

## Post-Recording

**Editing Checklist:**
- [ ] Audio is clear and consistent
- [ ] No background noise
- [ ] Video quality is full HD
- [ ] Transitions are smooth
- [ ] Total length is 5-7 minutes
- [ ] Captions/subtitles are optional but recommended
- [ ] No sensitive information visible

**File Export:**
- Format: MP4
- Codec: H.264
- Bitrate: 5000 kbps for file size
- Audio: AAC, 128 kbps

**Upload:**
- Platform: YouTube (private link preferred)
- Description: Include app name and version
- Include link to app.poppymarketingandconsulting.com

---

**Total Duration:** 6-7 minutes
**Total Scenes:** 5 major sections
**Key Features Demonstrated:** 5/5 (Login, Campaigns, Ad Sets, Ads, Rules)
