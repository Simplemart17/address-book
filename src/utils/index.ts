import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

function formatResponseObject (res: any): any {
  let dataArray:any = [];

  Object.keys(res).map((key) => {
    dataArray.push({...res[key], documentId: key})
  });

  return dataArray;
}

const IMAGE_URL: string[] = [
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1587235640/profile_pic.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662756/andrew-greene.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662886/cathlene-burrage.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662931/damaris-kimura.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662932/dianne-guilianelli.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662978/waylon-hyden.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662978/steven-mchail.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662978/ronni-cantadore.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662978/rinaldo-beynon.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662977/piers-wilkins.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662977/parker-johnson.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662976/kimberly-parsons.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662976/jaquelin-isch.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662976/jasmine-slater.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662976/ibrahim-frasch.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662976/heather-terry.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662976/gordon-sanderson.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662976/giordano-sagucio.jpg",
  "https://res.cloudinary.com/dq7p8ff2f/image/upload/v1700662976/erhart-cockrin.jpg"
];

const randomizeImageUrl = () => {
  const url = Math.floor(Math.random() * IMAGE_URL.length);
  return IMAGE_URL[url];
}

const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(
    password,
    Number(process.env.SALT_ROUNDS),
  );
  return hashedPassword;
};

function generateRandomNumber() {
  const randomNumber = Math.floor(Math.random() * 900000) + 100000;

  return randomNumber;
}

const generateToken = (user: any) => jwt.sign({
  data: user,
  exp: '7d'
}, process.env.VERIFY_SECRET as string);

const decoded = (token: string) => jwt.verify(token, process.env.VERIFY_SECRET as string);

export {
  formatResponseObject,
  randomizeImageUrl,
  debounce,
  hashPassword,
  generateRandomNumber,
  generateToken,
  decoded
};
