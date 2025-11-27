# Installation & Testing Guide

## Quick Install

### Step 1: Create ZIP File
1. Right-click the `online` folder
2. Select "Send to" → "Compressed (zipped) folder"
3. Name it `discord-style-chat.zip`

### Step 2: Upload to Discourse
1. Go to your Discourse Admin Panel
2. Navigate to **Customize** → **Themes**
3. Click **Install** → **Upload a theme**
4. Select your `discord-style-chat.zip` file
5. Click **Upload**

### Step 3: Activate
1. After upload, click on "Discord Style Chat"
2. Click **Add to your site** or make it your default theme
3. Refresh your Discourse page (Ctrl+Shift+R)

## Testing Checklist

### ✅ Visual Check
- [ ] Chat background is dark gray (#2f3136) - same as sidebar
- [ ] Chat header is dark gray - matches sidebar
- [ ] Message composer at bottom is dark gray - matches sidebar
- [ ] All chat text uses Quicksand font
- [ ] Online users sidebar appears on the right
- [ ] User avatars show in sidebar with green status dots

### ✅ User Card Check
- [ ] Click a username in the sidebar
- [ ] Discord-style card popup appears
- [ ] Card shows:
  - [ ] Gradient banner at top
  - [ ] Large profile avatar
  - [ ] Username and full name
  - [ ] Posts count
  - [ ] Likes count
  - [ ] Badges (if any)
  - [ ] Trust level
  - [ ] Profile button (blue)
  - [ ] Message button (gray)
  - [ ] Close X button
- [ ] Click outside card to close
- [ ] Click X button to close
- [ ] Click Profile button → goes to user profile
- [ ] Click Message button → goes to messages

### ✅ Browser Console Check
Open browser console (F12) and look for:
```
[Discord Style Chat] Plugin script loaded!
[Discord Style Chat] Page changed - initializing...
[Discord Style Chat] Settings: {sidebarEnabled: true, ...}
[Discord Style Chat] ✓ Sidebar added
[Discord Style Chat] Fetched X users
[Discord Style Chat] ✓ User list updated
```

## Troubleshooting

### User card doesn't show?
1. Check browser console for errors
2. Make sure you clicked a username IN THE SIDEBAR (not in chat)
3. Try refreshing the page

### Colors don't match?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Rebuild theme in admin panel

### Sidebar not showing?
1. Check theme is active
2. Check settings: `enable_online_sidebar` should be ON
3. See TROUBLESHOOTING.md for detailed steps

## What's Working

✅ Chat, header, and composer all use #2f3136 (sidebar color)  
✅ Quicksand font throughout  
✅ Online users sidebar on right  
✅ Discord-style user card popup with stats  
✅ Badges and trust level display  
✅ Profile and Message action buttons  

## Files in Theme

```
online/
├── about.json          - Theme metadata
├── settings.yml        - Configurable options
├── common/
│   ├── common.scss     - ALL STYLING (colors + user card)
│   └── head_tag.html   - ALL JAVASCRIPT (sidebar + user card)
├── desktop/
│   └── desktop.scss    - Desktop responsive styles
└── mobile/
    └── mobile.scss     - Mobile responsive styles
```

## Support

If something doesn't work:
1. Check browser console for `[Discord Style Chat]` messages
2. Review TROUBLESHOOTING.md
3. Verify all files are in the ZIP
4. Try disabling other theme components

Enjoy your Discord-style Discourse chat! 🎉
