# 🔥 DRAC'S POKEDEX

<div align="center">

![Pokémon](https://img.shields.io/badge/Pokémon-API-FFCB05?style=for-the-badge&logo=pokemon&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

**A stunning, interactive Pokédex featuring all 898 Pokémon with advanced search, detailed stats visualization, and a captivating dark gaming aesthetic.**

[Live Demo](https://web101-cap1-ity8.onrender.com/#) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation)

</div>

---

## 📸 Preview

Experience a modern, cyberpunk-inspired Pokédex with smooth animations, custom cursors, and an immersive dark theme that brings the world of Pokémon to life.

## ✨ Features

### 🎯 Core Functionality
- **Complete Pokédex Database** - Browse all 898 Pokémon from Generation I through VIII
- **Lightning-Fast Search** - Search by Pokémon name or National Pokédex number with real-time filtering
- **Infinite Scroll Pagination** - Seamless loading of 20 Pokémon at a time with intersection observer
- **Detailed Stats View** - Comprehensive modal with base stats, abilities, moves, and more

### 🎨 UI/UX Excellence
- **Dark Gaming Theme** - Cyberpunk-inspired design with royal purple accents and neon highlights
- **Custom Animated Cursor** - Interactive Charizard cursor that responds to user interactions
- **Type-Based Color Coding** - All 18 Pokémon types with authentic color schemes
- **Smooth Animations** - Fade-in effects, hover states, and interactive card animations
- **Responsive Grid Layout** - Adaptive design that works beautifully on all screen sizes
- **Interactive Grid Glow** - Dynamic cursor-following glow effect with pulse animations

### 📊 Advanced Features
- **Chart.js Integration** - Visualize base stats with beautiful, animated radar charts
- **Request Deduplication** - Custom fetch handler prevents duplicate API calls
- **Local Storage Support** - Favorites system ready for implementation
- **Error Handling** - Graceful error messages with animated notifications
- **Performance Optimized** - Debounced search, lazy loading, and efficient rendering
- **Accessibility Ready** - Semantic HTML and keyboard navigation support

### 🎮 Interactive Elements
- **Modal Details View** - Click any Pokémon to see comprehensive information:
  - National & Local Pokédex numbers
  - Type, Species, Height, Weight
  - All Abilities and Move sets
  - Catch Rate, Gender Ratio
  - Base Experience Level
  - Interactive stat charts
- **Loading Animations** - Animated Pikachu loader for a fun user experience
- **Hover Effects** - Cards glow and scale on hover with smooth transitions

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup with modern structure
- **CSS3** - Advanced styling with:
  - CSS Grid & Flexbox
  - Custom Properties (CSS Variables)
  - Keyframe Animations
  - Gradients & Glassmorphism
  - Media Queries for responsiveness
- **Vanilla JavaScript (ES6+)** - Modern JavaScript features:
  - ES6 Modules
  - Async/Await
  - Promises
  - Classes & OOP
  - Arrow Functions
  - Template Literals
  - Destructuring

### Libraries & APIs
- **PokéAPI** - RESTful Pokémon data (https://pokeapi.co)
- **Chart.js** - Beautiful, responsive charts
- **jQuery** - DOM manipulation utilities
- **Animate.css** - Pre-built CSS animations
- **Google Fonts** - Press Start 2P, Poppins, Flexo

### Architecture Patterns
- **Module Pattern** - Clean code separation with ES6 modules
- **Fetch Handler Class** - Centralized API request management
- **Observer Pattern** - Intersection Observer for infinite scroll
- **Debouncing** - Optimized search input handling
- **Promise Chaining** - Efficient asynchronous operations

## 🚀 Installation

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/KeldenPDorji/WEB101_CAP1.git
   cd WEB101_CAP1
   ```

2. **Open the project**
   - Simply open `index.html` in your browser, or
   - Use a local development server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   
   # Using VS Code Live Server extension
   # Right-click index.html > Open with Live Server
   ```

3. **Start exploring!**
   - Navigate to `http://localhost:8000` (or your server's address)
   - Search for your favorite Pokémon
   - Click cards to view detailed stats

## 📂 Project Structure

```
02230285_WEB101_PA1/
├── index.html              # Main HTML file
├── README.md               # Project documentation
└── public/
    ├── style.css          # Main stylesheet (1345 lines)
    ├── style.css.backup   # Style backups
    ├── style.css.backup2
    └── js/
        ├── app.js         # Main application logic (492 lines)
        └── fetchHandler.js # API request handler (41 lines)
```

## 💡 Key Implementations

### Custom Fetch Handler
```javascript
// Prevents duplicate API requests and manages loading states
class FetchHandler {
    GetJSON(url, options) {
        // Intelligent request management
        // Error handling & promise-based API
    }
}
```

### Infinite Scroll with Intersection Observer
```javascript
// Lazy loads Pokémon as user scrolls
const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !isLoading) {
        currentPage++;
        displayPokemon();
    }
});
```

### Type-Based Dynamic Styling
```javascript
// 18 Pokémon types with authentic colors
const typeColors = {
    fire: 'rgba(238, 129, 48, 0.5)',
    water: 'rgba(99, 144, 240, 0.5)',
    // ... all types mapped
};
```

## 🎓 Learning Outcomes

This project demonstrates proficiency in:

✅ **API Integration** - RESTful API consumption with error handling  
✅ **Asynchronous JavaScript** - Promises, async/await, fetch API  
✅ **DOM Manipulation** - Dynamic content rendering and updates  
✅ **Event Handling** - User interactions, debouncing, observers  
✅ **CSS Animations** - Keyframes, transitions, transforms  
✅ **Responsive Design** - Mobile-first, flexible layouts  
✅ **Performance Optimization** - Lazy loading, request management  
✅ **Code Organization** - Modular architecture, separation of concerns  
✅ **Data Visualization** - Chart.js integration for stats  
✅ **User Experience** - Loading states, error handling, smooth interactions

## 🌟 Highlights for Employers

- **Clean Code** - Well-organized, commented, maintainable JavaScript
- **Modern Practices** - ES6+, modules, async patterns
- **UI/UX Focus** - Attention to detail, smooth animations, user feedback
- **Problem Solving** - Custom solutions for pagination, search, and data management
- **Performance Aware** - Optimized rendering, debouncing, efficient DOM updates
- **Complete Project** - Fully functional from concept to deployment

## 🔮 Future Enhancements

- [ ] Favorites system with persistent storage
- [ ] Advanced filtering (by type, generation, stats)
- [ ] Pokémon comparison tool
- [ ] Evolution chain visualization
- [ ] Dark/Light theme toggle
- [ ] Sound effects and background music
- [ ] Battle simulator
- [ ] Team builder functionality

## 📝 Code Quality

- **Modularity**: Separated concerns with ES6 modules
- **Reusability**: DRY principles followed throughout
- **Maintainability**: Clear naming conventions and code comments
- **Scalability**: Easy to extend with new features
- **Performance**: Optimized for speed and efficiency

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co) for the comprehensive Pokémon database
- Nintendo, Game Freak, and The Pokémon Company for Pokémon
- [Chart.js](https://www.chartjs.org/) for beautiful data visualization
- Design inspiration from modern gaming interfaces and cyberpunk aesthetics
- Charizard cursor animation by [Tenor](https://tenor.com/)

---

<div align="center">

**Made with 💜 and ⚡ by Kelden Drac**

*If you found this project interesting, please give it a ⭐!*

</div>
