import { Disclosure } from 'disclosure-discord';

const client = new Disclosure(process.env.DATABASE_URI);

client.initialize().then(() => client.login());
