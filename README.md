# PH Clubs Web
![club_page](/img/club_image.png)

## Description
PH Clubs is a web application for the management system of PH Clubs. Jointly developed by Xiaochuan Qian (26') and Jianhe Liang (27') from Shanghai Pinghe School. This is the public repository of the project. 

The initiator of the PH Clubs System is Zichen Zhao, Shanghai Pinghe School Class of 2025. He is currently at MBZUAI, class of 2029.

![login_page](/img/login_page.png)
![club_page](/img/management_page.png)


## Getting Started

### Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Direct Deployment
#### Compile
```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

### Deploy with Docker (Recommended)

#### Build your container:
```bash
docker build -t nextjs-docker .
```
#### Run your container:
```bash
docker run -p 3000:3000 nextjs-docker
```