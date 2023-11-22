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
  console.log(url, "what value");
  return IMAGE_URL[url];
}

export { formatResponseObject, randomizeImageUrl }