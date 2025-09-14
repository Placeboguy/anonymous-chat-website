'use client';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Anonymous Chat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}