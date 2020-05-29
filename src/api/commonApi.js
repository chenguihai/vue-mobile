import { post, get } from '@/utils/req'
import { devUrl } from '@/utils/commonData'

export function uploadImage(data) { //图片视频 - 上传删除
    return post({ url: devUrl + '/admin/uploadImage', data }, null, { code: 1 })
}

export function reqInviteList(page) { //邀请分享列表
    return get({
        url: '/user/invite/list?page=' + page,
    })
}
export const requestCode = (id) => { //邀请码入驻
    return post({ url: '/user/invite/code', data: { inviteUserId: id } }, null, { code: 900 })
}