export const checkValidity = (value, rules) => {
  let isValid = true;
  if (!rules) {
    return true;
  }
  if (rules.required) {
    isValid =  value.trim() !== "" && isValid;
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
  }

  if (rules.maxLength) {
    isValid = value.length <= rules.maxLength && isValid;
  }

  if (rules.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid;
  }

  if (rules.isNumeric) {
    const pattern = /^\d+$/;
    isValid = pattern.test(value) && isValid;
  }

  return isValid;
};

export const updateObject = (oldObject, updatedProperties) => {
  return{
    ...oldObject,
    ...updatedProperties
  };
};

// export const replies = (comments) => {
//   const commentMap = {};
//   comments.forEach(comment => commentMap[comment.id] = comment);
//   comments.forEach(reply => {
//     if(reply.commentId){
//       const comment = commentMap[reply.commentId];
//       //comment.replies = (comment.replies || []).push(reply);
//      (comment.replies = comment.replies || []).push(reply); 
//     }
//   });
//   console.log(comments);
//   return comments.filter(comment => {
//     return !comment.commentId;
//   });
// };

export const replies = comments => {
  const map = {};
  const roots = [];

  comments.forEach((comment, index) => {
      map[comment.id] = index;
      comment.replies = [];
  });

  comments.forEach(comment => {
    if(comment.commentId) {
      comments[map[comment.commentId]].replies.push(comment);
    } else {
      roots.push(comment);
    }
  });
  return roots;
  
  // var i;
  // const map = {};
  // let node;
  // const roots = [];
  
  // for( i=0; i < comments.length; i++){
  //   map[comments[i].id] = i;
  //   comments[i].replies = [];
  // }

  // for( i = 0; i < comments.length; i++) {
  //   node = comments[i];
  //   if(node.commentId) {
  //     comments[map[node.commentId]].replies.push(node);
  //   } else {
  //     roots.push(node);
  //   }
  // }
  // return roots;
};