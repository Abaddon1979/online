# Quick Start Guide - Discord Style Chat

## Installation Steps

### 1. Prepare the Theme

Your theme component is ready to upload. The files are organized as:

```
online/
├── about.json
├── settings.yml
├── LICENSE
├── README.md
├── common/
│   ├── common.scss
│   └── header.html (contains JavaScript)
├── desktop/
│   └── desktop.scss
└── mobile/
    └── mobile.scss
```

### 2. Upload to Discourse

**Option A: Via Discourse Admin (Easiest)**

1. **Compress the folder:**
   - Right-click the `online` folder
   - Select "Send to" → "Compressed (zipped) folder"
   - Or use: `Compress-Archive -Path "online" -DestinationPath "discord-style-chat.zip"`

2. **Upload in Discourse:**
   - Go to **Admin** → **Customize** → **Themes**
   - Click **Install**
   - Select **Upload a theme** 
   - Choose your ZIP file
   - Click **Upload**

3. **Activate:**
   - After upload, click on "Discord Style Chat"
   - Click **Add to [YourTheme]** or make it your default theme

**Option B: From Git Repository**

If you've pushed to GitHub:
1. Admin → Customize → Themes → Install
2. Select "From a Git repository"
3. Enter your repository URL
4. Click Add

### 3. Verify It's Working

1. **Refresh your Discourse page** (hard refresh: Ctrl+Shift+R)

2. **Open Developer Console** (F12)
   - You should see: `[Discord Style Chat] Theme component loaded!`

3. **Look for the sidebar** on the right side of your screen

4. **Check the Elements tab:**
   - Search for `discord-online-users-sidebar`
   - It should exist in the DOM

### 4. Configure Settings (Optional)

1. Go to **Admin** → **Customize** → **Themes**
2. Click on **Discord Style Chat**
3. Click **Settings** tab
4. Adjust:
   - `enable_online_sidebar` - Turn sidebar on/off
   - `sidebar_width` - Width in pixels (default: 240)
   - `user_refresh_interval` - How often to update users (default: 30000ms)
   - `enable_discord_colors` - Apply Discord color scheme
   - `enable_quicksand_font` - Use Quicksand font

## Troubleshooting

### Sidebar Not Appearing?

**Check 1: Console Messages**
- Open Console (F12)
- Do you see `[Discord Style Chat] Theme component loaded!`?
  - ✅ Yes: JavaScript is running, check CSS
  - ❌ No: Theme not active or needs rebuild

**Check 2: Theme is Active**
- Admin → Customize → Themes
- Is "Discord Style Chat" listed under active components?
- If not, click it and select "Add to [Your Theme]"

**Check 3: Hard Refresh**
- Press `Ctrl + Shift + R` (Windows/Linux)
- Or `Cmd + Shift + R` (Mac)
- This clears the cache

**Check 4: Rebuild Theme**
- In Discourse Admin, find your theme
- Click the wrench icon or "Edit"
- Look for a "Rebuild" option
- Click it and wait

### Still Not Working?

1. **Check browser console for errors**
   - Any red error messages?
   - Share them for debugging

2. **Verify file structure**
   - Make sure `common/header.html` contains the `<script type="text/discourse-plugin">` tag

3. **Try disabling other components**
   - Temporarily disable other theme components to check for conflicts

4. **Check Discourse version**
   - This component requires Discourse 2.8.0 or higher
   - Check: Admin → Dashboard → "Version"

## What You Should See

After successful installation:

1. **Dark Discord theme** applied to chat
2. **Quicksand font** on all chat text
3. **Online users sidebar** on the right showing:
   - "Online — X" header
   - List of users with avatars
   - Green online status indicators
   - Click to visit user profiles

## Next Steps

- Customize colors in `common/common.scss`
- Adjust sidebar width in settings
- Add your own branding or modifications
- Share feedback or improvements!

---

**Need Help?** Check the full README.md or TROUBLESHOOTING.md for detailed information.
