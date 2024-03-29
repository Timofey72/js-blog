import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import { useDispatch, useSelector } from 'react-redux';

import { fetchPosts } from '../redux/slices/posts';
import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';

export const Home = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const postsData = useSelector((state) => state.posts);

  const isPostsLoading = postsData.status === 'loading';

  React.useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : postsData.posts).map((obj, i) =>
            isPostsLoading ? (
              <Post key={i} isLoading={true} />
            ) : (
              // CHANGE KEY
              <Post
                key={i}
                id={obj.id}
                title={obj.title}
                imageUrl={obj.image_url}
                user={{
                  fullName: `${obj.user_name} ${obj.user_surname}`,
                  avatarUrl: obj.user_avatar,
                }}
                createdAt={obj.created}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userData?.id == obj.user_id}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={postsData.tags} isLoading={isPostsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: 'Вася Пупкин',
                  avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                },
                text: 'Это тестовый комментарий',
              },
              {
                user: {
                  fullName: 'Иван Иванов',
                  avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                },
                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
