# Meta App Review Checklist

This document outlines the exact steps a Meta reviewer will follow when evaluating the Poppy Marketing Ads Manager application for approval.

## Pre-Review Checklist

### 1. Application Information Verification
- [ ] App name is "Poppy Marketing Ads Manager"
- [ ] App description is accurate and complete
- [ ] App category is "Ads Manager" or equivalent
- [ ] App icon and screenshots are professional and clear
- [ ] Privacy policy URL is accessible and complete
- [ ] Terms of Service URL is accessible and complete
- [ ] Support email is valid: support@poppymarketingandconsulting.com

### 2. Business Verification
- [ ] Company registration documents are provided
- [ ] Business address is verified
- [ ] Company representative information is complete

### 3. Tech Provider Verification
- [ ] Tech provider agreement is signed
- [ ] Tech provider details are verified in Meta Business Manager

## Feature Review Process

### 4. Facebook Login Implementation
**Reviewer will:**
1. Navigate to app.poppymarketingandconsulting.com
2. Click "Continue with Facebook Login for Business"
3. Authorize with their test business account
4. Verify they can successfully authenticate
5. Confirm session is maintained across page refreshes

**Expected Results:**
- ✓ Login flow works seamlessly
- ✓ No errors during authentication
- ✓ User is redirected to dashboard after login
- ✓ Sign out button works correctly

### 5. Ad Account Selection
**Reviewer will:**
1. After login, view the list of available ad accounts
2. Check that all their business's ad accounts are listed
3. Verify account names, IDs, and status display correctly

**Expected Results:**
- ✓ All ad accounts are listed
- ✓ Account information is accurate
- ✓ UI is clean and easy to use
- ✓ Account can be selected

### 6. Campaigns Management
**Reviewer will:**
1. Navigate to Campaigns section
2. View existing campaigns
3. Click "Create Campaign" button
4. Fill in campaign details:
   - Campaign name: "Test Campaign"
   - Objective: Select one option
5. Submit the form
6. Verify campaign appears in list

**Expected Results:**
- ✓ Campaign creation form appears
- ✓ All required fields are validated
- ✓ Campaign is created successfully
- ✓ New campaign appears in list immediately
- ✓ Error handling is graceful

### 7. Ad Sets Management
**Reviewer will:**
1. Click on an existing campaign
2. View ad sets for that campaign
3. Click "Add Ad Set" button
4. Fill in ad set details:
   - Ad set name: "Test Ad Set"
   - Daily budget: $100
5. Submit the form
6. Verify ad set appears under campaign

**Expected Results:**
- ✓ Ad set creation modal appears
- ✓ Form validation works
- ✓ Ad set is created successfully
- ✓ Ad set appears under campaign
- ✓ Budget is displayed correctly

### 8. Ads Management
**Reviewer will:**
1. Click on an ad set
2. View ads for that ad set
3. Click "Add Ad" button
4. Fill in ad details with either:
   - Option A: Existing creative ID
   - Option B: New creative (title, body, image URL)
5. Submit the form
6. Verify ad appears in list

**Expected Results:**
- ✓ Ad creation modal appears
- ✓ Both creative options work
- ✓ Form validation works
- ✓ Ad is created successfully
- ✓ Ad appears in list

### 9. Automated Rules
**Reviewer will:**
1. Navigate to Automated Rules section
2. Click "Create Rule" button
3. Fill in rule details:
   - Rule name: "Test Rule"
   - Daily spend threshold: $500
   - Ad set ID: (valid ad set ID)
4. Submit the form
5. Verify rule is created successfully

**Expected Results:**
- ✓ Rule creation modal appears
- ✓ Form validation works
- ✓ Rule is created successfully
- ✓ Success message is shown
- ✓ API call to Meta is made correctly

## Compliance Review

### 10. Requested Permissions Justification
Reviewer will verify that requested scopes align with app functionality:

**Requested Scopes:**
- `ads_management` - ✓ Required to create/manage campaigns, ad sets, and ads
- `business_management` - ✓ Required to access ad accounts
- `pages_show_list` - ✓ Required for future page management features
- `pages_read_engagement` - ✓ Required for analytics integration

Each scope must have clear justification in the app review submission.

### 11. Data Handling
Reviewer will verify:
- [ ] No access tokens are stored on client
- [ ] Tokens are only stored in secure session
- [ ] All API calls happen on server-side
- [ ] User data is not logged or shared
- [ ] HTTPS is enforced
- [ ] Subapace (if used) doesn't store sensitive data

### 12. Public Pages Verification
Reviewer will access and verify:

**Privacy Policy** (`/privacy-policy`)
- [ ] Page loads without errors
- [ ] Content is complete and professional
- [ ] Addresses data collection and usage
- [ ] Includes contact information
- [ ] Last updated date is current

**Terms of Service** (`/terms`)
- [ ] Page loads without errors
- [ ] Mentions Meta API usage and compliance
- [ ] Includes limitation of liability
- [ ] Specifies governing law
- [ ] Includes contact information

**Data Deletion** (`/data-deletion`)
- [ ] Page loads without errors
- [ ] Includes data deletion form
- [ ] Form submission works
- [ ] Confirmation message appears
- [ ] Alternative contact method provided

**Support** (`/support`)
- [ ] Page loads without errors
- [ ] Support form is functional
- [ ] Form validation works
- [ ] Submission sends request
- [ ] Alternative contact methods listed

### 13. Security Review
Reviewer will check:
- [ ] HTTPS is enforced
- [ ] No hardcoded secrets in code
- [ ] Environment variables are properly used
- [ ] API calls validate inputs
- [ ] Error messages don't expose sensitive info
- [ ] Rate limiting is in place (if applicable)

### 14. API Usage Review
Reviewer will verify:
- [ ] API calls use correct endpoints
- [ ] Correct graph API version is used (v20.0)
- [ ] All required fields are included in requests
- [ ] Error handling is implemented
- [ ] No data is cached unnecessarily
- [ ] Responses are handled securely

## Post-Review Actions

### 15. App Status Changes
After review, the app will either:

**If Approved:**
- [ ] App moves to "Live" status
- [ ] User can submit app for Meta App Review
- [ ] App can be used in production

**If Rejected:**
- [ ] Review feedback is provided
- [ ] Issues are addressed
- [ ] App is resubmitted
- [ ] Process repeats

## Common Rejection Reasons to Avoid

1. **Incomplete Data Handling Explanation**
   - Each scope must have clear justification
   - Solution: Complete permissions-justification.md thoroughly

2. **Missing or Incomplete Public Pages**
   - All required pages must be accessible
   - Solution: Verify all pages load and have complete content

3. **Unsafe Data Handling**
   - Tokens must not be stored on client-side
   - Solution: Keep tokens in secure server-side sessions only

4. **Unclear App Functionality**
   - App purpose must be immediately clear
   - Solution: Improve app description and screenshots

5. **Unverified Business Information**
   - Company must be properly registered and verified
   - Solution: Complete business verification before submission

## Timeline

- **Initial Submission:** 1-2 weeks to approval or rejection
- **Appeals/Resubmission:** 3-5 business days
- **Final Approval:** App goes live within 24 hours

## Key Contacts

- Meta Support: https://developers.facebook.com/support
- Business Verification: https://business.facebook.com
- Tech Provider Program: https://www.facebook.com/business/help

---

**Last Updated:** 2025-11-10
