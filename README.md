# TierList Architect

## Description

This project helps people create tier lists easily on mobile or desktop

## Getting Started

### Prerequisites

* Visual Studio Code
* pnpm: 10.5.2
* php: 8.3.11

### Configuration

Modify the following .env values:

```shell
NODE_ENV=DEVELOPMENT // either PRODUCTION or DEVELOPMENT
```

## Deployment

### On dev environment

1. Clone this repository:

```
git clone https://github.com/CPNV-RIA1/FE_MakeList.git
```

2. Install the packages:

```
pnpm install
```

3. Create the .env file

```
cp .env.example .env
```

4. Change the configuration of the .env file according to your own needs

5. Run the tests:

```
pnpm run test
```

6. Run the project:

Open 2 terminals and run

```
pnpm run dev
```

and

```
pnpm run tailwind
```

### On integration environment

1. Publish the project to whatever service you like (make sure to exclude all test files)

2. Install only the necessary packages:

```
pnpm install --omit=dev
```

3. Create the `.env` file

```
cp .env.example .env
```

4. Modify the values according to your production configuration

5. Run the application

```
pnpm run prod
```

## Directory structure

```shell
├── node_modules
│   └── ...
├── package.json
├── package-lock.json
├── pnpm-lock.yaml
├── public
│   ├── assets
│   │   ├── images
│   │   ├── scripts
│   │   └── styles
│   │       └── main.css #uncompiled tailwind css
│   ├── dist
│   │   └── styles.css #compiled tailwind css
│   └── index.html
├── README.md
└── tests
    ├── e2e
    └── unit
```

## Collaborate

### Branches

This project uses git flow. You can check it out [here](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

### Commits

This project uses conventional commits. You can check it out [here](https://www.conventionalcommits.org/en/v1.0.0/).

### New features

To propose new features, you can either create an issue or make a pull request if you intend to work on it yourself. 

## License

This project uses the MIT license.

## Contact

You can contact us via issues.
