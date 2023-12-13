import React from 'react';

type CardWithImageProps = {
  cardName: string;
  cardImage: string;
};

const CardWithImage = ({ cardName, cardImage }: CardWithImageProps) => {
  return (
    <div className={`bg-[url('/images/pic1.png')] h-[280px] w-[22%] bg-cover rounded-[16px] relative`}>
      <div className='backdrop-blur text-center p-3 absolute bottom-0 w-full'>
        {cardName}
      </div>
    </div>
  );
};

export default CardWithImage;
