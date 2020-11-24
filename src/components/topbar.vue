<script>
import { authComputed } from '@state/helpers'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'

export default {
	components: {
		// eslint-disable-next-line vue/no-unused-components
		VuePerfectScrollbar,
	},
	props: {
		user: {
			type: Object,
			required: false,
			default: () => ({}),
		},
		isMenuOpened: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {}
	},
	computed: {
		...authComputed,
	},
	methods: {
		toggleMenu() {
			this.$parent.toggleMenu()
		},
		toggleRightSidebar() {
			this.$parent.toggleRightSidebar()
		},
		logout(){
			this.$store.dispatch('auth/logOut')
			this.$router.push({ name: "login" })
		}
	},
}
</script>

<template>
	<!-- Topbar Start -->
	<div class="navbar navbar-expand flex-column flex-md-row navbar-custom" >
		<div class="container-fluid">
			<!-- LOGO -->
			<a href="/" class="navbar-brand mr-0 mr-md-2 logo">
				<span class="logo-lg">
			  <img src="@assets/images/tstvlogo.png" alt height="90"/>
					<!-- <span class="d-inline h5 ml-2 text-logo">InView</span> -->
				</span>
				<!-- <span class="logo-sm">
					<img src="@assets/images/logo.png" alt height="24" />
				</span> -->
			</a>

			<ul
				class="navbar-nav bd-navbar-nav flex-row list-unstyled menu-left mb-0"
        style="background-color:#26a69a;color:white;"
			>
				<li class>
					<button
						class="button-menu-mobile open-left disable-btn"
						:class="{ open: isMenuOpened }"
						@click="toggleMenu"
					>
						<feather type="menu" class="menu-icon align-middle"></feather>
						<feather type="x" class="close-icon"></feather>
					</button>
				</li>
			</ul>

			<ul
				class="navbar-nav flex-row ml-auto d-flex list-unstyled topnav-menu float-right mb-0"
			>
				<!-- <li class="d-none d-sm-block">
					<div class="app-search">
						<form>
							<div class="input-group">
								<input
									type="text"
									class="form-control"
									placeholder="Search..."
								/>
								<feather type="search" class="align-middle"></feather>
							</div>
						</form>
					</div>
				</li> -->

				<b-nav-item-dropdown
					right
					class="notification-list align-self-center profile-dropdown"
					toggle-class="nav-user mr-0"
				>
					<template v-slot:button-content>
						<div class="media user-profile">
							<!-- <img
								src="data:image/png;base64,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"
								alt="user-image"
								class="rounded-circle align-self-center"
							/> -->
							<div class="media-body text-left">
								<h6 class="pro-user-name ml-2 my-0">
									<span>{{ user.username }}</span>
									<h5 class="pro-user-desc text-muted d-block mt-1" style="color
                  :white"
										>Administrator</h5>
								</h6>
							</div>
							<feather
								type="chevron-down"
								class="ml-2 align-self-center"
							></feather>
						</div>
					</template>
					<b-dropdown-item href="#/profile" class="notify-item p-0">
						<feather type="user" class="icon-dual icon-xs mr-2"></feather>
						<span>My Account</span>
					</b-dropdown-item>

					<!-- <b-dropdown-divider></b-dropdown-divider> -->

					<b-dropdown-item cl	ass="notify-item p-0" @click="logout">
						<feather type="log-out" class="icon-dual icon-xs mr-2"></feather>
						<span>Logout</span>
					</b-dropdown-item>
				</b-nav-item-dropdown>
			</ul>
		</div>
	</div>
	<!-- end Topbar -->
</template>

<style lang="scss">
.noti-scroll {
	height: 220px;
}
.ps > .ps__scrollbar-y-rail {
	width: 8px !important;
	background-color: transparent !important;
}
.ps > .ps__scrollbar-y-rail > .ps__scrollbar-y,
.ps.ps--in-scrolling.ps--y > .ps__scrollbar-y-rail > .ps__scrollbar-y,
.ps > .ps__scrollbar-y-rail:active > .ps__scrollbar-y,
.ps > .ps__scrollbar-y-rail:hover > .ps__scrollbar-y {
	width: 6px !important;
}
.button-menu-mobile {
	outline: none !important;
}
.user-profile .pro-user-name {
    font-weight: 1000;
    color: white;
}
.text-muted {
    color: white !important;
}
.navbar-custom .topnav-menu .nav-link svg {
    display: inline-block;
    width: 20px;
    height: 20px;
    color: white;
    fill: rgba(75, 75, 90, 0.12);
}
.navbar-custom {
    position: fixed;
    
    color: white;
    top: 0;
    right: 0;
    left: 0;
    z-index: 100;
    height: 72px;
    padding: 0 22px 0 37px;
    /* background-color: #fff; */
    background-color: #26a69a;
    color: white;
    -webkit-box-shadow: 0 0.05rem 0.01rem rgba(75, 75, 90, 0.075);
    box-shadow: 0 0.05rem 0.01rem rgba(75, 75, 90, 0.075);
}
</style>
