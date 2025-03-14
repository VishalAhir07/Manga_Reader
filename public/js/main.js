document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
        <input type="checkbox" id="darkMode" class="theme-toggle-input">
        <label for="darkMode" class="theme-toggle-label">
            <i class="fas fa-sun"></i>
            <i class="fas fa-moon"></i>
            <span class="toggle-ball"></span>
        </label>
    `;

    // Insert the toggle switch in the nav-container
    document.querySelector('.nav-links').prepend(themeToggle);

    // Theme toggle functionality
    const darkModeToggle = document.getElementById('darkMode');
    
    // Check for saved theme preference or system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
        darkModeToggle.checked = true;
    }

    // Handle theme toggle
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', darkModeToggle.checked ? 'dark' : 'light');
    });

    // Get all search elements
    const searchInputs = [
        document.getElementById('searchInput'),
        document.getElementById('heroSearchInput')
    ];
    const searchButtons = [
        document.getElementById('searchButton'),
        document.getElementById('heroSearchButton')
    ];

    // Create suggestion containers for each search input
    searchInputs.forEach((input, index) => {
        if (input) {
            const suggestionsContainer = document.createElement('div');
            suggestionsContainer.className = 'search-suggestions';
            input.parentNode.appendChild(suggestionsContainer);

            let debounceTimer;

            // Add input event listener for suggestions
            input.addEventListener('input', async () => {
                const query = input.value.trim();
                clearTimeout(debounceTimer);

                if (query.length < 2) {
                    suggestionsContainer.innerHTML = '';
                    suggestionsContainer.style.display = 'none';
                    return;
                }

                debounceTimer = setTimeout(async () => {
                    try {
                        const response = await fetch(`/suggestions?q=${encodeURIComponent(query)}`);
                        if (!response.ok) throw new Error('Failed to get suggestions');
                        const suggestions = await response.json();

                        if (suggestions.length > 0) {
                            suggestionsContainer.innerHTML = suggestions
                                .map(manga => `
                                    <div class="suggestion-item" data-id="${manga.id}">
                                        <img src="${manga.cover}" alt="${manga.title}" onerror="this.src='/images/no-cover.png'">
                                        <div class="suggestion-info">
                                            <div class="suggestion-title">${manga.title}</div>
                                            <div class="suggestion-meta">
                                                <span>${manga.status}</span>
                                                ${manga.latestChapter ? `<span>Ch. ${manga.latestChapter}</span>` : ''}
                                            </div>
                                        </div>
                                    </div>
                                `).join('');
                            suggestionsContainer.style.display = 'block';

                            // Add click handlers for suggestions
                            suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
                                item.addEventListener('click', () => {
                                    window.location.href = `/manga/${item.dataset.id}`;
                                });
                            });
                        } else {
                            suggestionsContainer.innerHTML = '<div class="no-suggestions">No results found</div>';
                            suggestionsContainer.style.display = 'block';
                        }
                    } catch (error) {
                        console.error('Suggestion error:', error);
                    }
                }, 300); // Debounce delay
            });

            // Close suggestions when clicking outside
            document.addEventListener('click', (e) => {
                if (!input.contains(e.target) && !suggestionsContainer.contains(e.target)) {
                    suggestionsContainer.style.display = 'none';
                }
            });

            // Handle keyboard navigation
            input.addEventListener('keydown', (e) => {
                const items = suggestionsContainer.querySelectorAll('.suggestion-item');
                const current = suggestionsContainer.querySelector('.suggestion-item.selected');
                
                switch(e.key) {
                    case 'ArrowDown':
                        e.preventDefault();
                        if (!current) {
                            items[0]?.classList.add('selected');
                        } else {
                            const next = [...items].indexOf(current) + 1;
                            if (next < items.length) {
                                current.classList.remove('selected');
                                items[next].classList.add('selected');
                            }
                        }
                        break;
                    case 'ArrowUp':
                        e.preventDefault();
                        if (current) {
                            const prev = [...items].indexOf(current) - 1;
                            if (prev >= 0) {
                                current.classList.remove('selected');
                                items[prev].classList.add('selected');
                            }
                        }
                        break;
                    case 'Enter':
                        if (current) {
                            window.location.href = `/manga/${current.dataset.id}`;
                        }
                        break;
                }
            });
        }
    });

    // Handle search function
    const handleSearch = async (query) => {
        if (!query.trim()) return;

        try {
            window.location.href = `/search?q=${encodeURIComponent(query.trim())}`;
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    // Add event listeners to all search inputs and buttons
    searchInputs.forEach((input, index) => {
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSearch(input.value);
                }
            });

            // Add button click handler if there's a corresponding button
            if (searchButtons[index]) {
                searchButtons[index].addEventListener('click', () => {
                    handleSearch(input.value);
                });
            }
        }
    });

    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Add keyboard navigation for the reader
    if (document.querySelector('.reader')) {
        document.addEventListener('keydown', (e) => {
            const prevButton = document.querySelector('a.nav-button:first-child');
            const nextButton = document.querySelector('a.nav-button:last-child');

            switch(e.key) {
                case 'ArrowLeft':
                    if (prevButton) prevButton.click();
                    break;
                case 'ArrowRight':
                    if (nextButton) nextButton.click();
                    break;
            }
        });
    }
}); 