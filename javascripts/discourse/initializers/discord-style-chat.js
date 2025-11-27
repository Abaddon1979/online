import { withPluginApi } from "discourse/lib/plugin-api";
import { ajax } from "discourse/lib/ajax";
import { schedule } from "@ember/runloop";

const PLUGIN_ID = "discord-style-chat";

function initializeDiscordStyleChat(api) {
  const siteSettings = api.container.lookup("site-settings:main");
  
  // Check if sidebar is enabled
  if (!siteSettings.enable_online_sidebar) {
    return;
  }
  
  // Set CSS variable for sidebar width
  const sidebarWidth = siteSettings.sidebar_width || 240;
  document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
  
  // Add body class to enable sidebar
  document.body.classList.add("enable-online-sidebar");
  
  // Create and inject the sidebar
  function createSidebar() {
    // Check if sidebar already exists
    if (document.getElementById('discord-online-users-sidebar')) {
      return;
    }
    
    const sidebar = document.createElement('div');
    sidebar.id = 'discord-online-users-sidebar';
    sidebar.className = 'discord-sidebar';
    sidebar.innerHTML = `
      <div class="discord-sidebar-header">
        <h3>Online — <span class="online-count">0</span></h3>
      </div>
      <div class="discord-sidebar-users loading"></div>
    `;
    
    document.body.appendChild(sidebar);
    
    // Start fetching users
    fetchOnlineUsers();
    
    // Set up periodic refresh
    const refreshInterval = siteSettings.user_refresh_interval || 30000;
    setInterval(fetchOnlineUsers, refreshInterval);
  }
  
  // Fetch online users from Discourse API
  function fetchOnlineUsers() {
    const usersContainer = document.querySelector('.discord-sidebar-users');
    if (!usersContainer) return;
    
    ajax("/directory_items.json", {
      data: {
        period: "all",
        order: "likes_received",
        asc: false,
        limit: 50
      }
    })
      .then(data => {
        // Filter for online users (this is a simplified approach)
        // In a real implementation, you'd need a proper online status API
        const users = data.directory_items || [];
        
        // For now, we'll show all active users
        // You may need to adjust this based on your Discourse setup
        updateUsersList(users.slice(0, 20)); // Show top 20 users
      })
      .catch(error => {
        console.error("Error fetching online users:", error);
        usersContainer.classList.remove('loading');
        usersContainer.classList.add('empty');
      });
  }
  
  // Update the users list in the sidebar
  function updateUsersList(users) {
    const usersContainer = document.querySelector('.discord-sidebar-users');
    const countElement = document.querySelector('.online-count');
    
    if (!usersContainer || !countElement) return;
    
    usersContainer.classList.remove('loading', 'empty');
    
    if (users.length === 0) {
      usersContainer.classList.add('empty');
      countElement.textContent = '0';
      return;
    }
    
    countElement.textContent = users.length;
    
    usersContainer.innerHTML = users.map(item => {
      const user = item.user;
      const avatarUrl = user.avatar_template.replace('{size}', '96');
      
      return `
        <div class="discord-user-item" data-user-id="${user.id}">
          <div class="user-avatar">
            <img src="${avatarUrl}" alt="${user.username}">
            <div class="status-indicator"></div>
          </div>
          <div class="user-info">
            <div class="username">${user.username}</div>
            ${user.name ? `<div class="user-status">${user.name}</div>` : ''}
          </div>
        </div>
      `;
    }).join('');
    
    // Add click handlers to user items
    usersContainer.querySelectorAll('.discord-user-item').forEach(item => {
      item.addEventListener('click', () => {
        const userId = item.dataset.userId;
        const username = item.querySelector('.username').textContent;
        
        // Navigate to user profile
        window.location.href = `/u/${username}`;
      });
    });
  }
  
  // Alternative: Fetch from user presence API if available
  function fetchOnlineUsersFromPresence() {
    ajax("/presence/get", {
      data: {
        usernames: [] // Empty to get all
      }
    })
      .then(data => {
        const onlineUsers = Object.keys(data).filter(username => {
          const status = data[username];
          return status && status.state === 'online';
        });
        
        // Fetch user details for online users
        if (onlineUsers.length > 0) {
          Promise.all(
            onlineUsers.slice(0, 20).map(username =>
              ajax(`/u/${username}.json`)
            )
          ).then(usersData => {
            const formattedUsers = usersData.map(userData => ({
              user: userData.user
            }));
            updateUsersList(formattedUsers);
          });
        } else {
          updateUsersList([]);
        }
      })
      .catch(error => {
        // Fallback to directory items if presence API is not available
        console.warn("Presence API not available, using directory fallback");
        fetchOnlineUsers();
      });
  }
  
  // Initialize when chat is loaded
  api.onPageChange((url, title) => {
    schedule("afterRender", () => {
      // Check if we're on a chat page
      if (url.includes('/chat') || document.querySelector('.chat-container')) {
        createSidebar();
      }
    });
  });
  
  // Also initialize on first load if already on chat
  schedule("afterRender", () => {
    if (window.location.pathname.includes('/chat') || document.querySelector('.chat-container')) {
      createSidebar();
    }
  });
}

export default {
  name: PLUGIN_ID,
  
  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");
    
    withPluginApi("0.8.7", api => {
      initializeDiscordStyleChat(api);
    });
  }
};
