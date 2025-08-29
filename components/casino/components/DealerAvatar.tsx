
import React from 'react';

const DealerAvatar: React.FC = () => {
    const avatarUrl = "https://gateway.lighthouse.storage/ipfs/bafybeia6py55thrkwl6xd5cnqgcgpjgmohwc26r7jtfpqtrfr3dgdeos74/33.jpeg";

    return (
        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 pointer-events-none">
            <img
                src={avatarUrl}
                alt="Dealer Avatar"
                className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-yellow-400/80 shadow-2xl object-cover"
            />
        </div>
    );
};

export default DealerAvatar;
