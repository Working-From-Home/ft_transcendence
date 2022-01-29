import { InjectionKey } from "@vue/runtime-core";
import { AxiosInstance } from "axios";

export const AxiosKey: InjectionKey<AxiosInstance> = Symbol('http')