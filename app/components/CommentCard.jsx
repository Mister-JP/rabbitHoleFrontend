const CommentCard = ({ content, id, score, timestamp }) => {
  return (
    <div>
      <p>{timestamp}</p>
      <p>{content}</p>
      <p>
        {score[0]} lvl1, {score[1]} lvl2, {score[2]} lvl3, {score[3]} lvl4, {score[4]} lvl5
      </p>
    </div>
  );
};

export default CommentCard;
