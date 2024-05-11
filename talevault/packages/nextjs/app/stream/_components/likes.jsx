import Tippy from "@tippyjs/react";
import React, { useEffect, useState } from "react";
import { HeartIcon, } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline"   ;

const Likes = ({
  like,
  classes = "dark:bg-jacarta-700 absolute top-3 right-3 flex items-center space-x-1 rounded-md bg-white p-2",
}) => {
  const [likeState, setLikeState] = useState(
    like
  );
  const [likeNumber, setlikeNumber] = useState(likeState);

  const handleLike = () => {
    if (likeState >= likeNumber) {
      setlikeNumber((prev) => prev + 1);
    } else {
      setlikeNumber((prev) => prev - 1);
    }
  };

  return (
    <div className={classes} onClick={handleLike}>
      {/* <Tippy content={<span>Favorite</span>}> */}
        {/* <button className="js-likes relative cursor-pointer"> */}
          {likeState === likeNumber ? (
            <HeartOutline/>
          ) : (
            <HeartIcon/>
          )}
        
        {/* </button> */}
      {/* </Tippy> */}
      <span className="dark:text-jacarta-200 text-sm">{likeNumber}</span>
    </div>
  );
};

export default Likes;
