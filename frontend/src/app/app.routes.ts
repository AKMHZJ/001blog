import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component'; // We will create this next
import { SignupComponent } from './signup/signup.component';
import { HomeComponent } from './home/home.component';
import { MyBlogComponent } from './my-blog/my-blog.component';
import { PostPageComponent } from './post-page/post-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'feed', component: HomeComponent },
  { path: 'my-blog', component: MyBlogComponent },
  { path: 'post/:id', component: PostPageComponent },
  { path: '**', redirectTo: '' }, // Redirect unknown paths to home
];
