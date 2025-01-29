# Installation

> ⚠️ This project uses node v16.15.0

This project uses `pnpm` as its package manager. You can install it with `npm i -g pnpm`.

To install the dependencies, run

```
pnpm i
```

# Project structure
This project is a monorepo composed of two `apps`:
- `apps/server`: The backend API
- `apps/internal`: Shared code between the `server` and `web` apps
- `apps/web`: The frontend web app
- `packages/eslint-config`: Contains the eslint configuration
- `packages/ts-config`: Contains the typescript configuration

# Usage
### Deploying the api
To deploy de server run `pnpm deploy:prod:all` with this environment variables:
- `AWS_PROFILE=<your_profile>`: The aws profile to use defined in `~/.aws/credentials`. This is **optional**, if you don't provide it, the **default profile** will be used ([more info](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html)).
  
	```
	# ~/.aws/credentials file example
	
	[default]
	aws_access_key_id = <your_access_key_id>
	aws_secret_access_key = <your_secret_access_key>
	aws_account_id = <your_account_id>
	region = eu-west-1
	```
- `STAGE=prod`

For example:
``` 
 AWS_PROFILE=<your_profile> STAGE=prod pnpm deploy:prod:all
```

After the deploy is completed you should grab the api url either from your aws console or from the output of the deploy command.

It should look like this: 
> `https://<api_id>.execute-api.eu-west-1.amazonaws.com/prod`

### Running the web app
Before running the web you will need to build the `internal` package. To do so, run `pnpm build:internal`.

After building the package you can now run the web app, but before, you will need to create an `.env` file in `apps/web` folder with the following content:

> VITE_API_URL=<api_url>

`VITE_API_URL` should be the api url you got from the deploy command or from the aws console.

Then you can `cd apps/web` and run `pnpm run dev` to start the web app.

# License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

# Contributing
This project is not open to contributions.

# Tech Stack
- [pnpm](https://pnpm.io/)
- [Typescript](https://www.typescriptlang.org/)
- [Vue 3](https://v3.vuejs.org/)
- [Vite](https://vitejs.dev/)
- [AWS CDK](https://aws.amazon.com/cdk/)
- [Tailwind CSS](https://tailwindcss.com/)
- [DynamoDB](https://aws.amazon.com/dynamodb/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [AWS API Gateway](https://aws.amazon.com/api-gateway/)
- [Mocha](https://mochajs.org/)
- [Turborepo](https://turborepo.org/)

