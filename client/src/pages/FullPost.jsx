import React from 'react';
import Markdown from 'react-markdown';
import { useParams } from 'react-router-dom';

import axios from '../axios';

import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import { NotFound } from '../components/NotFound';

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const { id } = useParams();

  React.useEffect(() => {
    axios
      .get(`/post/${id}`)
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, []);

  if (isError) {
    return <NotFound />;
  }

  if (isLoading) {
    return <Post isLoading={isLoading} />;
  }

  return (
    <>
      <Post
        id={1}
        title={data.title}
        imageUrl={data.image_url}
        user={{
          fullName: `${data.user_name} ${data.user_surname}`,
          avatarUrl: data.user_avatar,
        }}
        createdAt={data.created}
        viewsCount={data.views_count}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <Markdown>{data.text}</Markdown>
      </Post>
      <CommentsBlock
        items={[
          {
            user: {
              fullName: 'Вася Пупкин',
              avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
            },
            text: 'Это тестовый комментарий 555555',
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
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
