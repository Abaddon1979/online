# Discord Style Chat - Discourse Theme Component

Transform your Discourse chat to look like Discord with an online users sidebar and Quicksand font!

## Features

✨ **Discord-Inspired Design**
- Dark theme with Discord's signature color palette (#36393f, #2f3136, #5865f2)
- Clean, modern message layout
- Hover effects and smooth transitions

👥 **Online Users Sidebar**
- Real-time display of online users on the right side
- User avatars with online status indicators
- Click users to view their profiles
- Configurable refresh interval

🎨 **Quicksand Font**
- Beautiful, modern typography throughout the chat
- Imported from Google Fonts
- Applied to messages, composer, and UI elements

📱 **Responsive Design**
- Desktop: Full sidebar experience
- Tablet: Optimized sidebar width
- Mobile: Hidden sidebar for better mobile UX

## Installation

### Method 1: Via Discourse Admin Panel (Recommended)

1. Go to your Discourse admin panel
2. Navigate to **Customize** → **Themes**
3. Click **Install** → **From a Git repository**
4. Enter the repository URL (or use "Upload a theme")
5. If uploading manually:
   - Compress the theme folder as a `.zip` file
   - Upload the zip file
6. Click **Add** to your site
7. Enable the theme component

### Method 2: Manual Installation

1. Clone or download this repository
2. Compress the entire folder as a `.zip` file
3. In Discourse admin panel, go to **Customize** → **Themes**
4. Click **Install** → **Upload a theme**
5. Select the zip file and upload
6. Activate the theme component

## Configuration

After installation, you can customize the following settings in **Customize** → **Themes** → **Discord Style Chat** → **Settings**:

| Setting | Default | Description |
|---------|---------|-------------|
| `enable_online_sidebar` | true | Show/hide the online users sidebar |
| `sidebar_width` | 240px | Width of the sidebar (180-400px) |
| `user_refresh_interval` | 30000ms | How often to refresh the user list |
| `enable_discord_colors` | true | Apply Discord color scheme |
| `enable_quicksand_font` | true | Use Quicksand font |

## File Structure

```
discord-style-chat/
├── about.json                          # Theme metadata
├── settings.yml                        # Configurable settings
├── common/
│   ├── common.scss                     # Core styles (Discord colors, fonts, sidebar)
│   └── header.html                     # Sidebar HTML template
├── desktop/
│   └── desktop.scss                    # Desktop-specific styles
├── mobile/
│   └── mobile.scss                     # Mobile-specific styles
└── javascripts/
    └── discourse/
        └── initializers/
            └── discord-style-chat.js   # Sidebar functionality & user fetching
```

## How It Works

### Styling
- **common.scss**: Applies Discord color palette, imports Quicksand font, styles chat messages, composer, and creates the sidebar layout
- **desktop.scss**: Optimizes sidebar for larger screens with enhanced hover effects
- **mobile.scss**: Hides sidebar on mobile devices for better UX

### JavaScript
The initializer (`discord-style-chat.js`):
1. Creates the sidebar element and injects it into the DOM
2. Fetches online users from Discourse API
3. Updates the user list periodically
4. Handles user clicks to navigate to profiles
5. Manages CSS variables for dynamic sidebar width

### User Detection
The component attempts to use multiple methods to detect online users:
- Primary: Discourse Presence API (if available)
- Fallback: Directory items API (shows most active users)

> **Note**: The accuracy of "online" status depends on your Discourse configuration and available APIs.

## Customization

### Changing Colors
Edit `common/common.scss` and modify the color variables:

```scss
$discord-dark: #36393f;        // Main background
$discord-darker: #2f3136;      // Sidebar background
$discord-blurple: #5865f2;     // Accent color (links, buttons)
$discord-text: #dcddde;        // Text color
$discord-online: #43b581;      // Online status indicator
```

### Changing Font
To use a different font, edit the `@import` statement in `common.scss`:

```scss
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@300;400;500;600;700&display=swap');
```

Then replace all instances of `'Quicksand'` with your font name.

### Adjusting Sidebar Position
The sidebar is fixed to the right by default. To move it to the left, modify `.discord-sidebar` in `common.scss`:

```scss
.discord-sidebar {
  left: 0;      // Change from right: 0
  right: auto;
}
```

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Troubleshooting

### Sidebar Not Appearing
1. Check that `enable_online_sidebar` is set to `true` in theme settings
2. Make sure you're on a chat page (`/chat`)
3. Check browser console for JavaScript errors
4. Verify the theme component is activated

### No Users Showing
1. The component needs API access to fetch users
2. Check if your Discourse has the Presence plugin enabled
3. Verify API permissions in Discourse settings

### Styles Not Applying
1. Clear your browser cache
2. Rebuild the theme in admin panel
3. Check for conflicts with other theme components
4. Ensure CSS is not being overridden by other themes

### Font Not Loading
1. Check internet connection (Google Fonts requires external access)
2. Verify Content Security Policy allows Google Fonts
3. Check browser console for blocked resources

## Contributing

Feel free to submit issues or pull requests to improve this theme component!

## License

MIT License - Feel free to use and modify as needed.

## Credits

- Inspired by Discord's beautiful UI design
- Quicksand font by Andrew Paglinawan
- Built for the Discourse community

## Screenshots

*Add screenshots of your Discord-styled chat here!*

---

Enjoy your Discord-style Discourse chat! 🎉
