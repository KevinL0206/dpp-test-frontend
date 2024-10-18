import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL('https://verisart-kevin-core.eu.ngrok.io/api/tagtt');
  
  url.search = request.nextUrl.search;

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    
    if (!data.is_authentic) {
      console.log('Redirecting to error page');
      return NextResponse.redirect(new URL('https://verisart-kevin-website.eu.ngrok.io/error'));
    }

    if (data.uid) {
      const redirectUrl = new URL(`https://verisart-kevin-website.eu.ngrok.io/${data.uid}`);
      if (data.token) {
        redirectUrl.searchParams.set('token', data.token);
      }
      console.log("Redirecting to:", redirectUrl.toString());
      return NextResponse.redirect(redirectUrl);
    }

    console.log('No redirection, returning JSON response');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
