import PocketBase from 'pocketbase';
const pb = new PocketBase(process.env.NEXT_PUBLIC_APP_URI);
export default pb;
