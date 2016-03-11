package com.dj.action;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class LoginAction {
		@RequestMapping("/")
		public ModelAndView login() throws Exception{
			return new ModelAndView("login");
		}
}
