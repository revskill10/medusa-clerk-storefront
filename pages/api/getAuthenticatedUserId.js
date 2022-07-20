import { withAuth, users } from "@clerk/nextjs/api";
import { client } from '../../lib/request'
const defaultPassword = 'supersecret'
const parseCookie = str =>
  str
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, v) => {
      acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
      return acc;
    }, {});
async function checkEmail(email) {
  const r = await client.get(`/store/auth/${email}`).catch(err => { return false })
  return r.data;
}
async function retrieveCustomer(email) {
  const r = await client.get(`/admin/customers?q=${email}`)
  return r.data
}
async function updateMedusaPassword(medusaUser) {
  const r = await client.post(`/admin/customers/${medusaUser.id}`, {
    password: defaultPassword
  })
  return r;
}
async function authenticateMedusaCustomer(email) {
  const r = await client.post(`/store/auth`, {
    email,
    password: defaultPassword
  })
  return { cookie: r.headers["set-cookie"], data: r.data };
}
async function createCustomer(user) {
  const r = await client({
    method: 'POST',
    url: '/admin/customers',
    data: {
      email: user.primaryEmailAddressId,
      password: 'supersecret',
      first_name: user.firstName,
      last_name: user.lastName,
      phone: user.phoneNumbers[0]?.phoneNumber
    }
  }).catch(err => { return false; })
  return r.data
}
async function updateClerkUserMeta(medusaCustomer, user) {
  const originalPublicMetadata = user.publicMetadata;
  const publicMetadata = {
    ...originalPublicMetadata,
    medusa_customer_id: medusaCustomer.id
  }
  await users.updateUser(user.id, {
    publicMetadata
  })
}
export default withAuth(async (req, res) => {
  const { sessionId, userId } = req.auth;

  if (!sessionId) {
    return res.status(401).json({ id: null });
  }
  const user = await users.getUser(userId);
  const email = user.emailAddresses[0]?.emailAddress;
  console.log('email', email)
  const data = await checkEmail(email);
  console.log('data', data);
  let medusaUser;
  if (!data.exists) {
    medusaUser = await createCustomer(user);
  } else {
    const r = await retrieveCustomer(email);
    medusaUser = r.customers[0];
  }
  await updateClerkUserMeta(medusaUser, user);
  await updateMedusaPassword(medusaUser);
  const { cookie, data: rData } = await authenticateMedusaCustomer(medusaUser.email);
  const cookieStr = cookie[0].split(';')[0].split('=')[1];
  console.log('cookie', cookieStr)
  res.setHeader('Set-Cookie', `connect.sid=${cookieStr}`);
  console.log('data', rData)
  return res.status(200).json({ data: medusaUser, cookieStr });
});
