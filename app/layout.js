'use client';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Anonymous Chat</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#f5f5f5',
        fontFamily: 'Inter, sans-serif',
        minHeight: '100vh'
      }}>
        {children}
      </body>
    </html>
  );
}