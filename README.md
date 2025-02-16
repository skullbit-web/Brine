<h1 align=center>Brine.<br >Lightweight, Anonymous Web Proxy 🚀</h1>
<img src="public/assets/BrineLogo.png" align=left width=128 height=128>

Brine is a high-performance web proxy designed for bypassing internet censorship with ease. Built on the powerful [Ultraviolet](https://github.com/titaniumnetwork-dev/Ultraviolet) backend, Brine provides a seamless and secure browsing experience with a focus on speed and anonymity. ⚡🔍🛡️

## Features ✨💡🔧

- **Lightweight**: Minimal resource usage for maximum efficiency.
- **Fast**: Optimized for low latency and high-speed browsing.
- **Anonymous**: Protects user privacy by masking online activity.
- **Custom UI**: A clean, minimalist frontend for easy navigation.
- **Seamless Integration**: Runs effortlessly on modern web hosting services.
- **Open Source**: Fully customizable for personal or organizational use.

## File Structure 📂🗂️📁

```
Brine/
│── node_modules/
│── public/
│   ├── assets/
│   ├── uv/
│   ├── 404.html
│   ├── background.html
│   ├── bg.js
│   ├── example.css
│   ├── example.js
│   ├── index.html
│   ├── test.css
│   ├── test.html
│   ├── test.js
│── index.js
│── LICENSE
│── package-lock.json
│── package.json
│── README.md
│── render.yaml
│── vercel.json
```

## Installation 🖥️📥⚙️

### Local Deployment 🏠💻🛠️
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/brine.git
   cd brine
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   node index.js
   ```
4. Open your browser and go to `http://localhost:3000`

### Deploy on Vercel ☁️🚀🔧
Brine includes a `vercel.json` configuration for easy deployment on [Vercel](https://vercel.com/):
1. Install Vercel CLI:
   ```sh
   npm install -g vercel
   ```
2. Deploy the project:
   ```sh
   vercel
   ```
3. Follow the instructions and get your live URL.

## Usage 🌍🔎👀

- Navigate to the main page (`index.html`).
- Enter a URL or search query to browse anonymously.
- The proxy will encode and serve the requested content through Ultraviolet.

## License 📜⚖️🔓

Brine is open-source software released under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing 🤝💡🔨

Contributions are welcome! Feel free to open issues or submit pull requests.

## Credits 🎖️🛠️🌎

- Built with [Ultraviolet](https://github.com/titaniumnetwork-dev/Ultraviolet)
- Inspired by open-source proxy networks.

---
🚀 **Brine**: Surf the web without limits. 🌊🌐🔥

