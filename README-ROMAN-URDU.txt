MS WEATHER — COMPLETE PROJECT
==============================

START KARNE KA ASAN TAREEQA
1. ZIP par right-click karein aur Extract All karein.
2. Extract hua MS-Weather folder kholein.
3. START-MS-WEATHER.bat par double-click karein.
4. Pehli dafa packages install honge; internet zaroori hai.
5. Browser mein http://localhost:5173 kholein.
6. Website chalate waqt black terminal window band na karein. Band karne se servers ruk jayenge.

REAL WEATHER API SETUP
- backend\.env file notepad se kholein.
- OPENWEATHER_API_KEY= ke baad apni OpenWeather API key paste karein.
- File save karein aur terminal mein Ctrl+C daba kar START-MS-WEATHER.bat dobara chalayen.
- API key public frontend mein mat daalein. Sirf backend\.env mein rakhein.
- frontend\.env mein sirf VITE_ wali cheezein hoti hain (koi secret nahi).

MONGODB NOTE
Is version mein weather caching filhaal server ki memory mein hai. MongoDB Atlas URI example file mein hai, lekin persistent MongoDB cache integration abhi implemented nahi hai. Is liye ise fully MongoDB-connected production build na samjhein.

LIVE DEPLOYMENT
Website live karne ke liye DEPLOY-ROMAN-URDU.txt dekhein (sirf Vercel, step by step). MongoDB abhi use nahi hota, is liye uski zaroorat nahi.

REQUIREMENTS
- Node.js LTS (Node 20+ recommended)
- npm
- Internet for first package installation
- OpenWeather API key for real weather search

TROUBLESHOOTING
- Agar 'node is not recognized' aaye to https://nodejs.org/ se Node.js LTS install karein, phir Command Prompt dobara kholein.
- Agar page blank ho, terminal ka red error aur browser F12 > Console ka screenshot bhejein.
- Weather API key na ho to dashboard design khul sakta hai, lekin real weather search kaam nahi karegi.


REAL WEATHER API SETUP:
1. Double-click SETUP-API-KEY.bat.
2. If you need a key, it opens the official OpenWeather API keys page.
3. Sign in/create an account, copy your API key, then run the BAT again and paste it.
4. Double-click START-MS-WEATHER.bat and open http://localhost:5173
Note: a real provider key cannot be generated on your behalf. Keep backend/.env private.


DESIGN UPDATE
- Premium red + white interface (palette: #000000, #830000, #BC0202, #FF0000) with MS Weather logo and navigation icons.
- On opening the website, real weather loads automatically for the last searched city, or Islamabad on first visit.
- No fake weather values are used. If the provider/backend fails, the app displays an error state.
- Default theme is light; the toggle switches to a warm dark theme.
