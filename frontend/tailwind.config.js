/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      maxWidth: {
        layout: '1260px',
        dialog: '460px',
      },
      fontFamily: {
        brand: ["'NBRB'", "'Inter'", 'sans-serif'],
      },
      boxShadow: {
        'btn-brand': '0 4px 16px -4px rgba(0, 188, 125, 0)',
        'btn-brand-hover': '0 4px 18px -4px rgba(0, 188, 125, 0.35)',
      },
      colors: {
        accent: {
          DEFAULT: '#00BC7D', // Accent
          hover: '#05CF8B', // Accent hover
          second: '#002C22CC', // AccentSecond (80%)
        },
        text: '#F3FDF8', // Text
        back: '#000000', // Back
        blocks: {
          DEFAULT: '#121212CC', // Blocks (80%)
          second: '#161616CC', // BlocksSecond (80%)
        },
        stroke: '#323232', // Stroke

        // Статусные цвета
        active: {
          DEFAULT: '#00BC7D', // Active
          back: '#002C22E6', // ActiveBack (90%)
        },
        upcoming: {
          DEFAULT: '#FE9A00', // Upcoming
          back: '#461901E6', // UpcomingBack (90%)
        },
        finished: {
          DEFAULT: '#2B7FFF', // Finished
          back: '#162456E6', // FinishedBack (90%)
        },
        sold: {
          DEFAULT: '#90A1B9', // Sold
          back: '#020618E6', // SoldBack (90%)
        },
        cancelled: {
          DEFAULT: '#FF2056', // Cancelled
          back: '#4D0218E6', // CancelledBack (90%)
        },
      },
    },
  },
  plugins: [],
};
