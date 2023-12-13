import React from 'react';

type CardWithImageProps = {
  cardName: string;
  cardImage: string;
};

const CardWithImage = ({ cardName, cardImage }: CardWithImageProps) => {
  return (
    <div style={{ backgroundImage: `url(${cardImage})` }} className={` h-[280px] w-[22%] bg-cover rounded-[16px] relative mb-10 z-0 mr-8`}>
      <div className='backdrop-blur text-center p-3 absolute bottom-0 w-full'>
        {cardName}
      </div>
    </div>
  );
};

export default CardWithImage;
