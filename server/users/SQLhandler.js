//add users
var addUser=function(userName) {
  client.query('INSERT INTO USERS (username) VALUES("{userName}");'.supplant({userName: userName}), function(err) {
    if (err) {
      throw err;
    }
  });
};

//add tag
var addTag=function(userName, tagName, coordinates) {
  //coordinates passed in as array of [lat, lng]
  client.query('INSERT INTO TAGS (user_id, tag, coordinates) VALUES( \
    (SELECT user_id FROM USERS \
    WHERE username="{userName}"), \
    "{tagName}", \
    "{coordinates})");'.supplant({userName: userName, tagName: tagName, coordinates: coordinates})
  );
}

//query all tags
var getTopTags=function() {
  return client.query(' \
    WITH tagCounts AS \
    ( \
      SELECT coordinates, tag, COUNT(*) as tagCount \
      FROM TAGS \
      GROUP BY tag, coordinates \
    ), \
    tagMax AS \
    ( \
      SELECT coordinates, MAX(tagCount) As maxTagCount \
      FROM tagCounts \
      GROUP BY coordinates \
    ) \
    SELECT c.coordinates, MAX(tag) as tag \
    FROM tagCounts AS c \
    INNER JOIN tagMax AS m on m.coordinates=c.coordinates AND c.tagCount = m.maxTagCount \
    GROUP BY c.coordinates;',
    function(err, results) {
      return results;
    }
  );
)};




