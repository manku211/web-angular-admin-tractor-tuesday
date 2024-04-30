export const styleObject = (status: any) => {
  if (status === 'ONGOING') {
    return { background: '#DED1F7', color: '#000' };
  }
  return {};
};

export const getExteriorImageUrl = (tractorData: any) => {
  if (tractorData && tractorData?.tractorId?.images) {
    const exteriorImage = tractorData.tractorId.images.find(
      (image: any) => image.type === 'exterior'
    );
    console.log(exteriorImage);
    if (exteriorImage) {
      return exteriorImage.link;
    }
  }
  return '';
};
